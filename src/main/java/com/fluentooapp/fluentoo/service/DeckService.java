package com.fluentooapp.fluentoo.service;

import com.fluentooapp.fluentoo.dto.DeckDto;
import com.fluentooapp.fluentoo.entity.Deck;
import java.util.List;

public interface DeckService {
    List<Deck> getMyDecks();

    List<Deck> getPublicDecks();

    List<Deck> getPublicDecksBySubject(Long subjectId);

    Deck createDeck(DeckDto deckDto);

    Deck updateDeck(Long id, DeckDto deckDto);

    void deleteDeck(Long id);

    List<Deck> findPublicDeck();

    Deck findById(Long id);

    void makePublic(Long id);

    void makePrivate(Long id);

    void linkUserToDeck(String email, Long deckId);

    List<Deck> selectPublicDeckBySubject(Long subjectId);

    void incrementLaunchCount(Long id);
}
