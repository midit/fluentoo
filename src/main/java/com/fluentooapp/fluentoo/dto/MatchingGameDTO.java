package com.fluentooapp.fluentoo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchingGameDTO {
    private Long id;
    private Long deckId;
    private Long completionTimeInSeconds;
    private int totalPairs;
    private int totalAttempts;
    private LocalDateTime createdAt;
}