package com.fluentooapp.fluentoo.repository;

import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.entity.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, Long> {
    Optional<UserStats> findByUser(User user);

    @Query("SELECT COUNT(DISTINCT r.user) FROM Revision r WHERE r.createdAt IS NOT NULL")
    Long countActiveUsers();
}