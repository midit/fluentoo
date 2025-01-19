package com.fluentooapp.fluentoo.dto;

import com.fluentooapp.fluentoo.entity.Deck;
import com.fluentooapp.fluentoo.entity.FlashCard;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevisionResponse {
    private Long id;
    private double score;
    private int totalFlashcards;
    private int correctFlashcards;
    private double percentage;
    private Deck deck;
    private List<FlashCard> flashcards;

    public RevisionResponse(Long id, double score) {
        this.id = id;
        this.score = score;
    }
}