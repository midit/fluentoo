package com.fluentooapp.fluentoo.service;

import com.fluentooapp.fluentoo.dto.MatchingGameDTO;
import java.util.List;

public interface MatchingGameService {
    MatchingGameDTO startNewGame(Long deckId);

    MatchingGameDTO getGame(Long gameId);

    MatchingGameDTO completeGame(Long gameId);

    List<MatchingGameDTO> getUserBestTimes(Long deckId);

    List<MatchingGameDTO> getRecentGames();
}