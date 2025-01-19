package com.fluentooapp.fluentoo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressData {
    private LocalDateTime date;
    private double score;
    private int totalCards;
    private int correctCards;
}