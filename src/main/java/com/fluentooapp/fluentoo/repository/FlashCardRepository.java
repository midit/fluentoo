package com.fluentooapp.fluentoo.repository;

import com.fluentooapp.fluentoo.entity.FlashCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface FlashCardRepository extends JpaRepository<FlashCard, Long> {
    @Query("SELECT f FROM FlashCard f LEFT JOIN FETCH f.deck WHERE f.deck.id = :deckId")
    List<FlashCard> findByDeckId(@Param("deckId") Long deckId);

    @Query("SELECT f FROM FlashCard f WHERE f.revisionTime <= :revisionTime")
    List<FlashCard> findByRevisionTime(@Param("revisionTime") Date revisionTime);
}
