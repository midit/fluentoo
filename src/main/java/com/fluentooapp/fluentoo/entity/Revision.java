package com.fluentooapp.fluentoo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "revisions")
public class Revision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id")
    private Deck deck;

    @NotNull
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Min(0)
    @Column(name = "total_flashcards")
    private int totalFlashcards = 0;

    @Min(0)
    @Column(name = "correct_flashcards")
    private int correctFlashcards = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public double getScore() {
        return totalFlashcards > 0 ? ((double) correctFlashcards / totalFlashcards) * 100 : 0;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
