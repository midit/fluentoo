package com.fluentooapp.fluentoo.controller;

import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.service.UserStatsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserStatsController {
    private static final Logger logger = LoggerFactory.getLogger(UserStatsController.class);
    private final UserStatsService userStatsService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(@AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                logger.error("User is null in getUserStats");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            logger.info("Fetching stats for user: {}", user.getEmail());
            Map<String, Object> stats = userStatsService.getDashboardStats(user);
            logger.info("Successfully fetched stats for user: {}", user.getEmail());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching user stats for user {}: {}", user != null ? user.getEmail() : "null",
                    e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to fetch user stats: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/daily-goal")
    public ResponseEntity<?> updateDailyGoal(@AuthenticationPrincipal User user, @RequestParam int goal) {
        try {
            if (user == null) {
                logger.error("User is null in updateDailyGoal");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            if (goal <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Daily goal must be greater than 0"));
            }

            logger.info("Updating daily goal for user: {} to {}", user.getEmail(), goal);
            userStatsService.setDailyGoal(user, goal);
            return ResponseEntity.ok(Map.of("message", "Daily goal updated successfully", "newGoal", goal));
        } catch (Exception e) {
            logger.error("Error updating daily goal for user {}: {}", user != null ? user.getEmail() : "null",
                    e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update daily goal: " + e.getMessage()));
        }
    }

    @GetMapping("/learning-activity")
    public ResponseEntity<Map<String, Object>> getLearningActivity(@AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                logger.error("User is null in getLearningActivity");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            logger.info("Fetching learning activity for user: {}", user.getEmail());
            Map<String, Object> activity = userStatsService.getLearningActivity(user);
            logger.info("Successfully fetched learning activity for user: {}", user.getEmail());
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            logger.error("Error fetching learning activity for user {}: {}", user != null ? user.getEmail() : "null",
                    e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to fetch learning activity: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}