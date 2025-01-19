package com.fluentooapp.fluentoo.repository;

import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.entity.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u IN (SELECT d.createdBy FROM Deck d WHERE d = :deck)")
    List<User> findByDecksContaining(@Param("deck") Deck deck);
}
