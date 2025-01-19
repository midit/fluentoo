package com.fluentooapp.fluentoo.controller;

import com.fluentooapp.fluentoo.dto.DeckDto;
import com.fluentooapp.fluentoo.entity.Deck;
import com.fluentooapp.fluentoo.entity.Subject;
import com.fluentooapp.fluentoo.service.DeckService;
import com.fluentooapp.fluentoo.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/decks")
public class DeckRestController {
    private static final Logger logger = LoggerFactory.getLogger(DeckRestController.class);

    @Autowired
    private DeckService deckService;

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getMyDecks() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null) {
                logger.error("No authentication found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "No authentication found"));
            }

            logger.info("Authentication type: {}", auth.getClass().getName());
            logger.info("Principal type: {}", auth.getPrincipal().getClass().getName());
            logger.info("Getting decks for user: {}", auth.getName());

            // Log all authorities
            auth.getAuthorities().forEach(authority -> logger.info("Authority: {}", authority.getAuthority()));

            List<Deck> decks = deckService.getMyDecks();
            logger.info("Found {} decks", decks.size());
            return ResponseEntity.ok(decks);
        } catch (Exception e) {
            logger.error("Error getting decks", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            response.put("type", e.getClass().getName());
            if (e.getCause() != null) {
                response.put("cause", e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDeck(@PathVariable Long id) {
        try {
            logger.info("Getting deck with id: {}", id);
            Deck deck = deckService.findById(id);
            logger.info("Found deck: {}", deck.getName());
            return ResponseEntity.ok(deck);
        } catch (Exception e) {
            logger.error("Error getting deck with id: " + id, e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            response.put("type", e.getClass().getName());
            if (e.getCause() != null) {
                response.put("cause", e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/public")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getPublicDecks() {
        try {
            logger.info("Getting public decks");
            List<Deck> decks = deckService.getPublicDecks();
            logger.info("Found {} public decks", decks.size());
            return ResponseEntity.ok(decks);
        } catch (Exception e) {
            logger.error("Error getting public decks", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            response.put("type", e.getClass().getName());
            if (e.getCause() != null) {
                response.put("cause", e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/public/subject/{subjectId}")
    public ResponseEntity<List<Deck>> getPublicDecksBySubject(@PathVariable Long subjectId) {
        List<Deck> decks = deckService.getPublicDecksBySubject(subjectId);
        return ResponseEntity.ok(decks);
    }

    @PostMapping
    public ResponseEntity<?> createDeck(@Valid @RequestBody DeckDto deckDto) {
        try {
            logger.info("Creating deck: {}", deckDto);
            Deck deck = deckService.createDeck(deckDto);
            logger.info("Created deck with id: {}", deck.getId());
            return ResponseEntity.ok(deck);
        } catch (Exception e) {
            logger.error("Error creating deck", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            response.put("type", e.getClass().getName());
            if (e.getCause() != null) {
                response.put("cause", e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Deck> updateDeck(@PathVariable Long id, @Valid @RequestBody DeckDto deckDto) {
        return ResponseEntity.ok(deckService.updateDeck(id, deckDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeck(@PathVariable Long id) {
        deckService.deleteDeck(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/subjects")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getSubjects() {
        try {
            logger.info("Getting all subjects");
            List<Subject> subjects = subjectService.getAllSubjects();
            logger.info("Found {} subjects", subjects.size());
            return ResponseEntity.ok(subjects);
        } catch (Exception e) {
            logger.error("Error getting subjects", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            response.put("type", e.getClass().getName());
            if (e.getCause() != null) {
                response.put("cause", e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}