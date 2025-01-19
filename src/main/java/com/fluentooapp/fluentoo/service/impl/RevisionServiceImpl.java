package com.fluentooapp.fluentoo.service.impl;

import com.fluentooapp.fluentoo.entity.*;
import com.fluentooapp.fluentoo.repository.*;
import com.fluentooapp.fluentoo.service.FlashCardService;
import com.fluentooapp.fluentoo.service.RevisionService;
import com.fluentooapp.fluentoo.service.UserService;
import com.fluentooapp.fluentoo.service.UserStatsService;
import com.fluentooapp.fluentoo.exception.ResourceNotFoundException;
import com.fluentooapp.fluentoo.exception.UnauthorizedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.*;
import org.springframework.security.core.context.SecurityContextHolder;
import com.fluentooapp.fluentoo.dto.RevisionResponse;
import com.fluentooapp.fluentoo.dto.AnswerRequest;
import com.fluentooapp.fluentoo.dto.ProgressData;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RevisionServiceImpl implements RevisionService {

    private static final Logger logger = LoggerFactory.getLogger(RevisionServiceImpl.class);

    private final RevisionRepository revisionRepository;
    private final DeckRepository deckRepository;
    private final UserRepository userRepository;
    private final FlashCardService flashCardService;
    private final UserStatsService userStatsService;

    @PersistenceContext
    private EntityManager entityManager;

    public RevisionServiceImpl(
            RevisionRepository revisionRepository,
            DeckRepository deckRepository,
            UserRepository userRepository,
            FlashCardService flashCardService,
            FlashCardRepository flashCardRepository,
            UserService userService,
            UserStatsService userStatsService) {
        this.revisionRepository = revisionRepository;
        this.deckRepository = deckRepository;
        this.userRepository = userRepository;
        this.flashCardService = flashCardService;
        this.userStatsService = userStatsService;
    }

    @Override
    @Transactional
    public Revision newDeckRevision(Long deckId, String userEmail) {
        // Fetch the deck and user
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", deckId));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        // Check if user has access to the deck
        if (!deck.isPublic() && !deck.getCreatedBy().equals(user)) {
            throw new UnauthorizedException("You don't have access to this deck");
        }

        // Increment launch count
        deck.setLaunchCount(deck.getLaunchCount() + 1);
        deckRepository.save(deck);

        // Create a new revision
        Revision revision = new Revision();
        revision.setDeck(deck);
        revision.setUser(user);
        revision.setCreatedAt(LocalDateTime.now());

        // Fetch flashcards associated with the deck
        List<FlashCard> flashcards = flashCardService.findFlashCardByDeckId(deckId);
        if (flashcards.isEmpty()) {
            throw new IllegalStateException("No flashcards found for this deck.");
        }

        // Set total count
        revision.setTotalFlashcards(flashcards.size());
        revision.setCorrectFlashcards(0);

        // Save the revision
        try {
            revision = revisionRepository.save(revision);
            // Update decks studied count
            userStatsService.updateDeckStudied(user);
            return revision;
        } catch (Exception e) {
            logger.error("Failed to save revision: {}", e.getMessage());
            throw new IllegalStateException("Failed to save revision", e);
        }
    }

    @Override
    public Revision findById(Long id) {
        return revisionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Revision", "id", id));
    }

    @Override
    public void update(Revision revision) {
        revisionRepository.save(revision);
    }

    @Override
    @Transactional(readOnly = true)
    public RevisionResponse getRevision(Long id) {
        try {
            logger.info("Getting revision with id: {}", id);

            if (id == null) {
                logger.error("Revision id cannot be null");
                throw new IllegalArgumentException("Revision id cannot be null");
            }

            Revision revision = revisionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Revision", "id", id.toString()));

            validateOwnership(revision);

            // Get flashcards for the deck
            List<FlashCard> flashcards = flashCardService.findFlashCardByDeckId(revision.getDeck().getId());
            if (flashcards.isEmpty()) {
                logger.error("No flashcards found for deck: {}", revision.getDeck().getId());
                throw new IllegalStateException("No flashcards found for this deck");
            }

            // Calculate percentage
            double percentage = 0;
            if (revision.getTotalFlashcards() > 0) {
                percentage = ((double) revision.getCorrectFlashcards() / revision.getTotalFlashcards()) * 100;
            }

            RevisionResponse response = new RevisionResponse();
            response.setId(revision.getId());
            response.setScore(revision.getScore());
            response.setTotalFlashcards(revision.getTotalFlashcards());
            response.setCorrectFlashcards(revision.getCorrectFlashcards());
            response.setPercentage(percentage);
            response.setDeck(revision.getDeck());
            response.setFlashcards(flashcards);

            return response;
        } catch (Exception e) {
            logger.error("Error getting revision: {}", e.getMessage());
            throw new IllegalStateException("Failed to get revision", e);
        }
    }

    @Override
    @Transactional
    public RevisionResponse submitAnswer(Long id, AnswerRequest answerRequest) {
        try {
            logger.info("Submitting answer for revision {}: {}", id, answerRequest);

            Revision revision = revisionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Revision", "id", id));

            validateOwnership(revision);

            // Update correct flashcards count if answer is correct
            if (answerRequest.getCorrect()) {
                revision.setCorrectFlashcards(revision.getCorrectFlashcards() + 1);
                // Add 15 points for correct answer
                userStatsService.updateUserStats(revision.getUser(), 15, 1, 0);
            } else {
                // Subtract 5 points for wrong answer
                userStatsService.updateUserStats(revision.getUser(), -5, 1, 0);
            }

            // Save the revision
            revisionRepository.save(revision);

            return getRevision(id);
        } catch (Exception e) {
            logger.error("Error submitting answer: {}", e.getMessage());
            throw new IllegalStateException("Failed to submit answer", e);
        }
    }

    @Override
    public List<ProgressData> getProgress() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        List<Revision> revisions = revisionRepository.findByUser(user);
        List<ProgressData> progressDataList = new ArrayList<>();

        for (Revision revision : revisions) {
            ProgressData progressData = new ProgressData();
            progressData.setDate(revision.getCreatedAt());
            progressData.setScore(revision.getScore());
            progressData.setTotalCards(revision.getTotalFlashcards());
            progressData.setCorrectCards(revision.getCorrectFlashcards());
            progressDataList.add(progressData);
        }

        return progressDataList;
    }

    @Override
    public Map<String, Object> getDashboardData(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Map<String, Object> dashboard = new HashMap<>();

        // Get user stats
        UserStats userStats = userStatsService.getUserStats(user);
        dashboard.put("userStats", userStats);

        // Get all revisions
        List<Revision> revisions = revisionRepository.findByUser(user);
        dashboard.put("revisions", revisions);

        return dashboard;
    }

    @Override
    public List<Revision> findAllByUserAndDeck(String userId, Long deckId) {
        return revisionRepository.findAllByUserEmailAndDeckId(userId, deckId);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private void validateOwnership(Revision revision) {
        User currentUser = getCurrentUser();
        if (!revision.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have access to this revision");
        }
    }
}
