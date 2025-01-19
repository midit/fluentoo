package com.fluentooapp.fluentoo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDto {
    private Long flashcardId;
    private String answer;
    private boolean correct;
}