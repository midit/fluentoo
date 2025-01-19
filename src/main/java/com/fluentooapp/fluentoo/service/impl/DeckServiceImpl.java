package com.fluentooapp.fluentoo.service.impl;

import java.util.List;
import com.fluentooapp.fluentoo.dto.DeckDto;
import com.fluentooapp.fluentoo.entity.Deck;
import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.repository.DeckRepository;
import com.fluentooapp.fluentoo.repository.SubjectRepository;
import com.fluentooapp.fluentoo.repository.UserRepository;
import com.fluentooapp.fluentoo.repository.UserStatsRepository;
import com.fluentooapp.fluentoo.repository.RevisionRepository;
import com.fluentooapp.fluentoo.repository.MatchingGameRepository;
import com.fluentooapp.fluentoo.service.DeckService;
import com.fluentooapp.fluentoo.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class DeckServiceImpl implements DeckService {
    private static final Logger logger = LoggerFactory.getLogger(DeckServiceImpl.class);

    private final DeckRepository deckRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final RevisionRepository revisionRepository;
    private final MatchingGameRepository matchingGameRepository;

    public DeckServiceImpl(DeckRepository deckRepository, SubjectRepository subjectRepository,
            UserRepository userRepository, UserStatsRepository userStatsRepository,
            RevisionRepository revisionRepository,
            MatchingGameRepository matchingGameRepository) {
        this.deckRepository = deckRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.revisionRepository = revisionRepository;
        this.matchingGameRepository = matchingGameRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Deck> getMyDecks() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            logger.info("Getting decks for user email: {}", email);

            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        logger.error("User not found with email: {}", email);
                        return new ResourceNotFoundException("User", "email", email);
                    });
            logger.info("Found user: {}", currentUser.getEmail());

            List<Deck> decks = deckRepository.findByCreatedBy(currentUser);
            // Initialize the subject for each deck to avoid lazy loading issues
            decks.forEach(deck -> {
                if (deck.getSubject() != null) {
                    deck.getSubject().getName(); // Force initialization
                }
            });
            logger.info("Found {} decks for user", decks.size());
            return decks;
        } catch (Exception e) {
            logger.error("Error in getMyDecks", e);
            throw e;
        }
    }

    @Override
    public void linkUserToDeck(String userEmail, Long deckId) {
        try {
            logger.info("Linking user {} to deck {}", userEmail, deckId);
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
            Deck deck = deckRepository.findById(deckId)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", deckId));

            // Since we removed the user_decks table, we only need to check if the deck is
            // public
            if (!deck.isPublic() && !deck.getCreatedBy().equals(user)) {
                throw new IllegalStateException("Cannot link private deck to user");
            }
            logger.info("Successfully verified deck access");
        } catch (Exception e) {
            logger.error("Error linking user to deck", e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void deleteDeck(Long id) {
        try {
            logger.info("Deleting deck with id: {}", id);
            Deck deck = deckRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", id));

            // First, delete all matching games associated with this deck
            matchingGameRepository.deleteByDeckId(id);

            // Delete all revisions associated with the deck
            revisionRepository.deleteByDeckId(deck.getId());

            // Clear flashcards
            if (deck.getFlashCards() != null) {
                deck.getFlashCards().forEach(flashCard -> flashCard.setDeck(null));
                deck.getFlashCards().clear();
                deckRepository.save(deck);
            }

            // Finally delete the deck
            deckRepository.delete(deck);
            logger.info("Successfully deleted deck");
        } catch (Exception e) {
            logger.error("Error deleting deck", e);
            throw e;
        }
    }

    @Override
    public List<Deck> findPublicDeck() {
        try {
            logger.info("Finding all public decks");
            List<Deck> decks = deckRepository.findByIsPublicTrue();
            logger.info("Found {} public decks", decks.size());
            return decks;
        } catch (Exception e) {
            logger.error("Error finding public decks", e);
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Deck findById(Long id) {
        try {
            logger.info("Finding deck by id: {}", id);
            Deck deck = deckRepository.findByIdWithDetails(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", id));
            logger.info("Found deck: {}", deck.getName());
            return deck;
        } catch (Exception e) {
            logger.error("Error finding deck by id", e);
            throw e;
        }
    }

    @Override
    public void makePublic(Long id) {
        try {
            logger.info("Making deck {} public", id);
            Deck deck = deckRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", id));
            deck.setPublic(true);
            deckRepository.save(deck);
            logger.info("Successfully made deck public");
        } catch (Exception e) {
            logger.error("Error making deck public", e);
            throw e;
        }
    }

    @Override
    public void makePrivate(Long id) {
        try {
            logger.info("Making deck {} private", id);
            Deck deck = deckRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", id));
            deck.setPublic(false);
            deckRepository.save(deck);
            logger.info("Successfully made deck private");
        } catch (Exception e) {
            logger.error("Error making deck private", e);
            throw e;
        }
    }

    @Override
    public List<Deck> getPublicDecksBySubject(Long subjectId) {
        try {
            logger.info("Getting public decks for subject: {}", subjectId);
            List<Deck> decks = deckRepository.findBySubjectIdAndIsPublicTrue(subjectId);
            logger.info("Found {} public decks for subject", decks.size());
            return decks;
        } catch (Exception e) {
            logger.error("Error getting public decks by subject", e);
            throw e;
        }
    }

    @Override
    public Deck updateDeck(Long id, DeckDto deckDto) {
        try {
            logger.info("Updating deck: {}", id);
            Deck deck = deckRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", id));

            deck.setName(deckDto.getName());
            deck.setDescription(deckDto.getDescription());
            deck.setSubject(subjectRepository.findById(deckDto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", deckDto.getSubjectId())));
            deck.setPublic(deckDto.isPublic_());

            Deck updatedDeck = deckRepository.save(deck);
            logger.info("Successfully updated deck");
            return updatedDeck;
        } catch (Exception e) {
            logger.error("Error updating deck", e);
            throw e;
        }
    }

    @Override
    public Deck createDeck(DeckDto deckDto) {
        try {
            logger.info("Creating deck with data: {}", deckDto);

            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            logger.info("Current user email: {}", currentUserEmail);

            User currentUser = userRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", "current"));
            logger.info("Found current user: {}", currentUser.getEmail());

            Deck deck = new Deck();
            deck.setName(deckDto.getName());
            deck.setDescription(deckDto.getDescription());
            deck.setSubject(subjectRepository.findById(deckDto.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", deckDto.getSubjectId())));
            deck.setCreatedBy(currentUser);
            deck.setPublic(deckDto.isPublic_());
            deck.setCreatedAt(LocalDateTime.now());

            Deck savedDeck = deckRepository.save(deck);
            logger.info("Successfully created deck with id: {}", savedDeck.getId());
            return savedDeck;
        } catch (Exception e) {
            logger.error("Error creating deck", e);
            throw e;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Deck> getPublicDecks() {
        try {
            logger.info("Getting all public decks");
            List<Deck> decks = deckRepository.findByIsPublicTrue();
            // Initialize the subject for each deck to avoid lazy loading issues
            decks.forEach(deck -> {
                if (deck.getSubject() != null) {
                    deck.getSubject().getName(); // Force initialization
                }
            });
            logger.info("Found {} public decks", decks.size());
            return decks;
        } catch (Exception e) {
            logger.error("Error getting public decks", e);
            throw e;
        }
    }

    @Override
    public List<Deck> selectPublicDeckBySubject(Long subjectId) {
        try {
            logger.info("Selecting public decks for subject: {}", subjectId);
            List<Deck> decks = deckRepository.findBySubjectIdAndIsPublicTrue(subjectId);
            logger.info("Found {} public decks for subject", decks.size());
            return decks;
        } catch (Exception e) {
            logger.error("Error selecting public decks by subject", e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void incrementLaunchCount(Long id) {
        try {
            logger.info("Incrementing launch count for deck: {}", id);
            Deck deck = deckRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", id));
            deck.setLaunchCount(deck.getLaunchCount() + 1);
            deckRepository.save(deck);
            logger.info("Successfully incremented launch count for deck: {}", id);
        } catch (Exception e) {
            logger.error("Error incrementing launch count for deck: {}", id, e);
            throw e;
        }
    }
}
