package com.fluentooapp.fluentoo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_stats")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder.Default
    private int studyStreak = 0;

    @Builder.Default
    private int pointsEarned = 0;

    @Builder.Default
    private int cardsReviewed = 0;

    @Builder.Default
    private int decksStudied = 0;

    @Builder.Default
    private int dailyPointsGoal = 1500;

    private LocalDateTime lastUpdated;

    @Builder.Default
    private int matchingGamesCompleted = 0;

    @Builder.Default
    private int matchingGamePoints = 0;

    @Builder.Default
    private int totalMatchesFound = 0;

    @Builder.Default
    private int totalMatchingAttempts = 0;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        lastUpdated = LocalDateTime.now();
    }
}