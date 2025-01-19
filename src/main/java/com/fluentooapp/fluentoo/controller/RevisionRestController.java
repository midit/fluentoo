package com.fluentooapp.fluentoo.controller;

import com.fluentooapp.fluentoo.entity.Revision;
import com.fluentooapp.fluentoo.service.RevisionService;
import com.fluentooapp.fluentoo.service.UserService;
import com.fluentooapp.fluentoo.dto.RevisionResponse;
import com.fluentooapp.fluentoo.dto.AnswerRequest;
import com.fluentooapp.fluentoo.dto.ProgressData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@RestController
@RequestMapping("/api/revisions")
public class RevisionRestController {

    private static final Logger logger = LoggerFactory.getLogger(RevisionRestController.class);

    private final RevisionService revisionService;
    private final UserService userService;

    public RevisionRestController(RevisionService revisionService, UserService userService) {
        this.revisionService = revisionService;
        this.userService = userService;
    }

    @PostMapping("/deck")
    @Transactional
    public ResponseEntity<?> createDeckRevision(@RequestParam Long deckId) {
        try {
            String userEmail = userService.getAuthUser().getEmail();
            Revision revision = revisionService.newDeckRevision(deckId, userEmail);

            // Log the number of flashcards
            logger.info("Number of flashcards loaded: {}", revision.getTotalFlashcards());

            RevisionResponse response = revisionService.getRevision(revision.getId());
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Cannot start revision with empty deck. Please add flashcards first.");
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            logger.error("Error creating deck revision: {}", e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to start revision: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<RevisionResponse> getRevision(@PathVariable Long id) {
        RevisionResponse revision = revisionService.getRevision(id);
        if (revision.getTotalFlashcards() == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(revision);
    }

    @PostMapping("/{id}/answer")
    public ResponseEntity<?> submitAnswer(@PathVariable Long id, @RequestBody AnswerRequest answerRequest) {
        try {
            RevisionResponse revision = revisionService.submitAnswer(id, answerRequest);
            return ResponseEntity.ok(revision);
        } catch (Exception e) {
            logger.error("Error submitting answer for revision {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to submit answer");
        }
    }

    @GetMapping("/progress")
    public ResponseEntity<?> getProgress() {
        try {
            logger.info("Fetching progress data");
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                logger.error("No authentication found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authentication required"));
            }

            List<ProgressData> progressData = revisionService.getProgress();
            logger.info("Successfully fetched progress data");
            return ResponseEntity.ok(progressData);
        } catch (Exception e) {
            logger.error("Error fetching progress data: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to fetch progress data: " + e.getMessage()));
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        try {
            String userEmail = userService.getAuthUser().getEmail();
            Map<String, Object> dashboardData = revisionService.getDashboardData(userEmail);
            return ResponseEntity.ok(dashboardData);
        } catch (Exception e) {
            logger.error("Error getting dashboard data", e);
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}