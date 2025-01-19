package com.fluentooapp.fluentoo.repository;

import com.fluentooapp.fluentoo.entity.Revision;
import com.fluentooapp.fluentoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Repository
public interface RevisionRepository extends JpaRepository<Revision, Long> {
        @EntityGraph(attributePaths = { "user", "deck" })
        Optional<Revision> findById(Long id);

        @EntityGraph(attributePaths = { "user", "deck" })
        List<Revision> findByUser(User user);

        @Query("SELECT r FROM Revision r WHERE r.user = :user AND r.createdAt BETWEEN :startDate AND :endDate")
        List<Revision> findByUserAndCreatedAtBetween(@Param("user") User user,
                        @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

        @EntityGraph(attributePaths = { "user", "deck" })
        List<Revision> findAllByUserEmailAndDeckId(String userEmail, Long deckId);

        @Modifying
        @Query("DELETE FROM Revision r WHERE r.deck.id = :deckId")
        void deleteByDeckId(@Param("deckId") Long deckId);
}
