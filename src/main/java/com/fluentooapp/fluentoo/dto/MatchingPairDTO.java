package com.fluentooapp.fluentoo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchingPairDTO {
    private Long flashcardId;
    private String question;
    private String answer;
    private boolean matched;
}