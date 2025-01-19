package com.fluentooapp.fluentoo.service.impl;

import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.entity.UserStats;
import com.fluentooapp.fluentoo.entity.Revision;
import com.fluentooapp.fluentoo.repository.UserStatsRepository;
import com.fluentooapp.fluentoo.repository.RevisionRepository;
import com.fluentooapp.fluentoo.service.UserStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UserStatsServiceImpl implements UserStatsService {
    private static final Logger logger = LoggerFactory.getLogger(UserStatsServiceImpl.class);
    private final UserStatsRepository userStatsRepository;
    private final RevisionRepository revisionRepository;

    @Override
    @Transactional
    public UserStats getUserStats(User user) {
        return userStatsRepository.findByUser(user)
                .orElseGet(() -> createInitialUserStats(user));
    }

    @Override
    @Transactional
    public Map<String, Object> getDashboardStats(User user) {
        try {
            UserStats stats = getUserStats(user);
            Map<String, Object> dashboard = new HashMap<>();

            // Basic stats with null checks
            dashboard.put("studyStreak", stats != null ? stats.getStudyStreak() : 0);
            dashboard.put("pointsEarned", stats != null ? stats.getPointsEarned() : 0);
            dashboard.put("cardsReviewed", stats != null ? stats.getCardsReviewed() : 0);
            dashboard.put("decksStudied", stats != null ? stats.getDecksStudied() : 0);
            dashboard.put("dailyPointsGoal", stats != null ? stats.getDailyPointsGoal() : 0);

            // Add matching game statistics
            dashboard.put("matchingGamesCompleted", stats != null ? stats.getMatchingGamesCompleted() : 0);
            dashboard.put("matchingGamePoints", stats != null ? stats.getMatchingGamePoints() : 0);
            dashboard.put("totalMatchesFound", stats != null ? stats.getTotalMatchesFound() : 0);
            dashboard.put("totalMatchingAttempts", stats != null ? stats.getTotalMatchingAttempts() : 0);
            dashboard.put("matchAccuracy", stats != null ? calculateMatchAccuracy(stats) : 0.0);

            return dashboard;
        } catch (Exception e) {
            logger.error("Error getting dashboard stats: {}", e.getMessage());
            // Return default values if there's an error
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("studyStreak", 0);
            dashboard.put("pointsEarned", 0);
            dashboard.put("cardsReviewed", 0);
            dashboard.put("decksStudied", 0);
            dashboard.put("dailyPointsGoal", 0);
            dashboard.put("matchingGamesCompleted", 0);
            dashboard.put("matchingGamePoints", 0);
            dashboard.put("totalMatchesFound", 0);
            dashboard.put("totalMatchingAttempts", 0);
            dashboard.put("matchAccuracy", 0.0);
            return dashboard;
        }
    }

    @Override
    @Transactional
    public Map<String, Object> getLearningActivity(User user) {
        try {
            List<String> labels = new ArrayList<>();
            List<Integer> values = new ArrayList<>();

            Map<String, Object> activity = new HashMap<>();
            activity.put("labels", labels);
            activity.put("values", values);
            return activity;
        } catch (Exception e) {
            logger.error("Error getting learning activity: {}", e.getMessage());
            // Return empty activity data
            Map<String, Object> activity = new HashMap<>();
            activity.put("labels", new ArrayList<>());
            activity.put("values", new ArrayList<>());
            return activity;
        }
    }

    @Override
    @Transactional
    public void updateUserStats(User user, int pointsEarned, int cardsReviewed, int decksStudied) {
        UserStats stats = getUserStats(user);

        // Update basic stats
        stats.setPointsEarned(stats.getPointsEarned() + pointsEarned);
        stats.setCardsReviewed(stats.getCardsReviewed() + cardsReviewed);
        stats.setDecksStudied(stats.getDecksStudied() + decksStudied);

        // Update study streak
        updateStudyStreak(stats);

        // Save the updated stats
        userStatsRepository.save(stats);

        logger.info(
                "Updated user stats - User: {}, Points: {}, Cards: {}, Decks: {}",
                user.getEmail(),
                stats.getPointsEarned(),
                stats.getCardsReviewed(),
                stats.getDecksStudied());
    }

    private void updateStudyStreak(UserStats stats) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastUpdated = stats.getLastUpdated();

        if (lastUpdated == null) {
            stats.setStudyStreak(1);
            return;
        }

        // Check if the last activity was yesterday
        boolean isYesterday = lastUpdated.toLocalDate().plusDays(1).equals(now.toLocalDate());
        // Check if the last activity was today
        boolean isToday = lastUpdated.toLocalDate().equals(now.toLocalDate());

        if (isYesterday) {
            // Increment streak if last activity was yesterday
            stats.setStudyStreak(stats.getStudyStreak() + 1);
        } else if (!isToday) {
            // Reset streak if more than one day has passed
            stats.setStudyStreak(1);
        }
        // If it's the same day, don't change the streak
    }

    @Override
    @Transactional
    public void updateAfterAnswer(User user, boolean isCorrect) {
        UserStats stats = getUserStats(user);
        stats.setCardsReviewed(stats.getCardsReviewed() + 1);
        if (isCorrect) {
            stats.setPointsEarned(stats.getPointsEarned() + 10);
        }
        userStatsRepository.save(stats);
    }

    @Override
    @Transactional
    public void updateAfterMatchingGame(User user, int points, int matchesFound, int attempts) {
        UserStats stats = getUserStats(user);
        stats.setMatchingGamePoints(stats.getMatchingGamePoints() + points);
        stats.setMatchingGamesCompleted(stats.getMatchingGamesCompleted() + 1);
        stats.setTotalMatchesFound(stats.getTotalMatchesFound() + matchesFound);
        stats.setTotalMatchingAttempts(stats.getTotalMatchingAttempts() + attempts);

        // Update points earned
        updateUserStats(user, points, 0, 1);

        userStatsRepository.save(stats);
    }

    private UserStats createInitialUserStats(User user) {
        UserStats stats = UserStats.builder()
                .user(user)
                .studyStreak(0)
                .pointsEarned(0)
                .cardsReviewed(0)
                .decksStudied(0)
                .dailyPointsGoal(1500)
                .lastUpdated(LocalDateTime.now())
                .matchingGamesCompleted(0)
                .matchingGamePoints(0)
                .totalMatchesFound(0)
                .totalMatchingAttempts(0)
                .build();
        return userStatsRepository.save(stats);
    }

    @Override
    @Transactional
    public void setDailyGoal(User user, int newDailyGoal) {
        if (newDailyGoal <= 0) {
            throw new IllegalArgumentException("Daily goal must be greater than 0");
        }
        UserStats stats = getUserStats(user);
        stats.setDailyPointsGoal(newDailyGoal);
        userStatsRepository.save(stats);
    }

    private double calculateMatchAccuracy(UserStats stats) {
        if (stats.getMatchingGamesCompleted() == 0 || stats.getTotalMatchingAttempts() == 0) {
            return 0.0;
        }

        // Calculate accuracy: (total optimal attempts / total actual attempts) * 100
        // Optimal attempts equals total matches found (since each match should take 1
        // attempt in perfect play)
        double accuracy = ((double) stats.getTotalMatchesFound() / stats.getTotalMatchingAttempts()) * 100;

        // Cap at 100% and round to 1 decimal place
        return Math.min(Math.round(accuracy * 10.0) / 10.0, 100.0);
    }

    @Override
    public void updateDeckStudied(User user) {
        UserStats stats = getUserStats(user);
        stats.setDecksStudied(stats.getDecksStudied() + 1);
        userStatsRepository.save(stats);
    }
}