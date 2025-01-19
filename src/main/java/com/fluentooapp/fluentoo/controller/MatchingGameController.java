package com.fluentooapp.fluentoo.controller;

import com.fluentooapp.fluentoo.dto.MatchingGameDTO;
import com.fluentooapp.fluentoo.service.MatchingGameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching-game")
@RequiredArgsConstructor
public class MatchingGameController {

    private final MatchingGameService matchingGameService;

    @PostMapping("/start/{deckId}")
    public ResponseEntity<MatchingGameDTO> startNewGame(@PathVariable Long deckId) {
        return ResponseEntity.ok(matchingGameService.startNewGame(deckId));
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<MatchingGameDTO> getGame(@PathVariable Long gameId) {
        return ResponseEntity.ok(matchingGameService.getGame(gameId));
    }

    @PostMapping("/{gameId}/complete")
    public ResponseEntity<MatchingGameDTO> completeGame(@PathVariable Long gameId) {
        return ResponseEntity.ok(matchingGameService.completeGame(gameId));
    }

    @GetMapping("/best-times/{deckId}")
    public ResponseEntity<List<MatchingGameDTO>> getBestTimes(@PathVariable Long deckId) {
        return ResponseEntity.ok(matchingGameService.getUserBestTimes(deckId));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<MatchingGameDTO>> getRecentGames() {
        return ResponseEntity.ok(matchingGameService.getRecentGames());
    }
}