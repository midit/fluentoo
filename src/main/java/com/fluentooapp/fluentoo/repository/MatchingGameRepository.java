package com.fluentooapp.fluentoo.repository;

import com.fluentooapp.fluentoo.entity.MatchingGame;
import com.fluentooapp.fluentoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchingGameRepository extends JpaRepository<MatchingGame, Long> {
    @Modifying
    @Query("DELETE FROM MatchingGame mg WHERE mg.deck.id = :deckId")
    void deleteByDeckId(Long deckId);

    List<MatchingGame> findTop10ByDeckIdAndUserOrderByCompletionTimeInSecondsAsc(Long deckId, User user);

    List<MatchingGame> findTop10ByUserOrderByCreatedAtDesc(User user);

    List<MatchingGame> findByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);
}