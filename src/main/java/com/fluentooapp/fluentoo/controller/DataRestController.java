package com.fluentooapp.fluentoo.controller;

import com.fluentooapp.fluentoo.entity.Revision;
import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.entity.UserStats;
import com.fluentooapp.fluentoo.repository.RevisionRepository;
import com.fluentooapp.fluentoo.repository.UserStatsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
public class DataRestController {

    private static final Logger logger = LoggerFactory.getLogger(DataRestController.class);

    @Autowired
    private RevisionRepository revisionRepository;

    @Autowired
    private UserStatsRepository userStatsRepository;

    @PostMapping("/update-stats")
    public ResponseEntity<?> updateStats(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            User user = new User();
            user.setId(userId);

            List<Revision> revisions = revisionRepository.findByUser(user);
            UserStats stats = userStatsRepository.findByUser(user)
                    .orElseGet(() -> {
                        UserStats newStats = new UserStats();
                        newStats.setUser(user);
                        return newStats;
                    });

            int totalCardsReviewed = 0;
            LocalDateTime lastStudyDate = null;

            for (Revision revision : revisions) {
                totalCardsReviewed += revision.getTotalFlashcards();

                if (lastStudyDate == null || revision.getCreatedAt().isAfter(lastStudyDate)) {
                    lastStudyDate = revision.getCreatedAt();
                }
            }

            logger.info("Total cards reviewed: {}, Last study date: {}", totalCardsReviewed, lastStudyDate);

            stats.setCardsReviewed(totalCardsReviewed);
            // stats.setLastStudyDate(lastStudyDate);

            if (lastStudyDate != null) {
                long daysSinceLastStudy = ChronoUnit.DAYS.between(lastStudyDate, LocalDateTime.now());
                if (daysSinceLastStudy <= 1) {
                    stats.setStudyStreak(1);
                } else {
                    stats.setStudyStreak(0);
                }
            }

            userStatsRepository.save(stats);
            logger.info("Saved updated stats for user: {}", user.getEmail());

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error updating stats: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
