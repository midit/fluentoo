package com.fluentooapp.fluentoo.service.impl;

import com.fluentooapp.fluentoo.dto.MatchingGameDTO;
import com.fluentooapp.fluentoo.entity.Deck;
import com.fluentooapp.fluentoo.entity.FlashCard;
import com.fluentooapp.fluentoo.entity.MatchingGame;
import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.entity.UserStats;
import com.fluentooapp.fluentoo.exception.ResourceNotFoundException;
import com.fluentooapp.fluentoo.exception.UnauthorizedException;
import com.fluentooapp.fluentoo.repository.DeckRepository;
import com.fluentooapp.fluentoo.repository.FlashCardRepository;
import com.fluentooapp.fluentoo.repository.MatchingGameRepository;
import com.fluentooapp.fluentoo.repository.UserRepository;
import com.fluentooapp.fluentoo.repository.UserStatsRepository;
import com.fluentooapp.fluentoo.service.MatchingGameService;
import com.fluentooapp.fluentoo.service.UserStatsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingGameServiceImpl implements MatchingGameService {

    private static final Logger logger = LoggerFactory.getLogger(MatchingGameServiceImpl.class);

    private final MatchingGameRepository matchingGameRepository;
    private final DeckRepository deckRepository;
    private final UserRepository userRepository;
    private final FlashCardRepository flashCardRepository;
    private final UserStatsService userStatsService;
    private final UserStatsRepository userStatsRepository;

    @Override
    @Transactional
    public MatchingGameDTO startNewGame(Long deckId) {
        User currentUser = getCurrentUser();
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck", "id", deckId));

        if (!deck.isPublic() && !deck.getCreatedBy().equals(currentUser)) {
            throw new UnauthorizedException("You don't have access to this deck");
        }

        // Increment launch count
        deck.setLaunchCount(deck.getLaunchCount() + 1);
        deck = deckRepository.save(deck);

        List<FlashCard> flashCards = flashCardRepository.findByDeckId(deckId);
        if (flashCards.isEmpty()) {
            throw new IllegalStateException("No flashcards found for this deck");
        }

        MatchingGame game = new MatchingGame();
        game.setDeck(deck);
        game.setUser(currentUser);
        game.setTotalPairs(flashCards.size());

        game = matchingGameRepository.save(game);

        return convertToDTO(game, flashCards);
    }

    @Override
    public MatchingGameDTO getGame(Long gameId) {
        MatchingGame game = matchingGameRepository.findById(gameId)
                .orElseThrow(() -> new ResourceNotFoundException("Game", "id", gameId));
        validateOwnership(game);

        List<FlashCard> flashCards = flashCardRepository.findByDeckId(game.getDeck().getId());
        return convertToDTO(game, flashCards);
    }

    @Override
    @Transactional
    public MatchingGameDTO completeGame(Long gameId) {
        MatchingGame gameEntity = matchingGameRepository.findById(gameId)
                .orElseThrow(() -> new ResourceNotFoundException("Game", "id", gameId));
        validateOwnership(gameEntity);

        if (gameEntity.getCompletionTimeInSeconds() != null) {
            throw new IllegalStateException("Game is already completed");
        }

        // Get user stats
        UserStats userStats = userStatsRepository.findByUser(gameEntity.getUser())
                .orElseThrow(() -> new ResourceNotFoundException("UserStats", "user", gameEntity.getUser().getId()));

        // Log current stats before update
        logger.info(
                "Before update - User stats for {}: matchingGamesCompleted={}, totalMatchesFound={}, totalMatchingAttempts={}",
                gameEntity.getUser().getEmail(),
                userStats.getMatchingGamesCompleted(),
                userStats.getTotalMatchesFound(),
                userStats.getTotalMatchingAttempts());

        // Update matching game statistics
        userStats.setMatchingGamesCompleted(userStats.getMatchingGamesCompleted() + 1);
        userStats.setMatchingGamePoints(userStats.getMatchingGamePoints() + (gameEntity.getTotalPairs() * 5));
        userStats.setTotalMatchesFound(userStats.getTotalMatchesFound() + gameEntity.getTotalPairs());
        userStats.setTotalMatchingAttempts(userStats.getTotalMatchingAttempts() + gameEntity.getTotalAttempts());

        // Log stats after update
        logger.info(
                "After update - User stats for {}: matchingGamesCompleted={}, totalMatchesFound={}, totalMatchingAttempts={}",
                gameEntity.getUser().getEmail(),
                userStats.getMatchingGamesCompleted(),
                userStats.getTotalMatchesFound(),
                userStats.getTotalMatchingAttempts());

        // Log game stats
        logger.info("Game stats for game {}: totalPairs={}, totalAttempts={}",
                gameId,
                gameEntity.getTotalPairs(),
                gameEntity.getTotalAttempts());

        // Update general user stats
        userStatsService.updateUserStats(
                gameEntity.getUser(),
                gameEntity.getTotalPairs() * 5, // 5 points per matched pair
                gameEntity.getTotalPairs(), // Each completed game counts as cards reviewed
                0 // No time tracking needed
        );

        // Save both entities
        userStats = userStatsRepository.save(userStats);
        MatchingGame savedGame = matchingGameRepository.save(gameEntity);

        List<FlashCard> flashCards = flashCardRepository.findByDeckId(savedGame.getDeck().getId());
        return convertToDTO(savedGame, flashCards);
    }

    @Override
    public List<MatchingGameDTO> getUserBestTimes(Long deckId) {
        User currentUser = getCurrentUser();
        return matchingGameRepository.findTop10ByDeckIdAndUserOrderByCompletionTimeInSecondsAsc(deckId, currentUser)
                .stream()
                .map(game -> convertToDTO(game, new ArrayList<>()))
                .collect(Collectors.toList());
    }

    @Override
    public List<MatchingGameDTO> getRecentGames() {
        User currentUser = getCurrentUser();
        return matchingGameRepository.findTop10ByUserOrderByCreatedAtDesc(currentUser)
                .stream()
                .map(game -> convertToDTO(game, new ArrayList<>()))
                .collect(Collectors.toList());
    }

    private MatchingGameDTO convertToDTO(MatchingGame game, List<FlashCard> flashCards) {
        MatchingGameDTO dto = new MatchingGameDTO();
        dto.setId(game.getId());
        dto.setDeckId(game.getDeck().getId());
        dto.setCompletionTimeInSeconds(game.getCompletionTimeInSeconds());
        dto.setTotalPairs(game.getTotalPairs());
        dto.setTotalAttempts(game.getTotalAttempts());
        dto.setCreatedAt(game.getCreatedAt());
        return dto;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    private void validateOwnership(MatchingGame game) {
        User currentUser = getCurrentUser();
        if (!game.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Not authorized to access this game");
        }
    }
}