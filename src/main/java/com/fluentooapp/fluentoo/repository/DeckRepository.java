package com.fluentooapp.fluentoo.repository;

import com.fluentooapp.fluentoo.entity.Deck;
import com.fluentooapp.fluentoo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeckRepository extends JpaRepository<Deck, Long> {

    @Query("SELECT DISTINCT d FROM Deck d LEFT JOIN FETCH d.subject WHERE d.createdBy = :user")
    List<Deck> findByCreatedBy(@Param("user") User user);

    @Query("SELECT DISTINCT d FROM Deck d LEFT JOIN FETCH d.subject LEFT JOIN FETCH d.flashCards WHERE d.id = :id")
    Optional<Deck> findByIdWithDetails(@Param("id") Long id);

    @EntityGraph(attributePaths = { "subject", "flashCards", "createdBy" })
    @Query("SELECT DISTINCT d FROM Deck d WHERE d.isPublic = true")
    List<Deck> findByIsPublicTrue();

    @EntityGraph(attributePaths = { "subject", "flashCards", "createdBy" })
    @Query("SELECT DISTINCT d FROM Deck d WHERE d.subject.id = :subjectId AND d.isPublic = true")
    List<Deck> findBySubjectIdAndIsPublicTrue(@Param("subjectId") Long subjectId);
}
