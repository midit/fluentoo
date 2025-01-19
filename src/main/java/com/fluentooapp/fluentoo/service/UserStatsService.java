package com.fluentooapp.fluentoo.service;

import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.entity.UserStats;
import java.util.Map;

public interface UserStatsService {
    UserStats getUserStats(User user);

    Map<String, Object> getDashboardStats(User user);

    Map<String, Object> getLearningActivity(User user);

    void updateUserStats(User user, int pointsEarned, int cardsReviewed, int studyTimeMinutes);

    void setDailyGoal(User user, int newDailyGoal);

    void updateAfterAnswer(User user, boolean isCorrect);

    void updateAfterMatchingGame(User user, int points, int matchesFound, int attempts);

    void updateDeckStudied(User user);
}
