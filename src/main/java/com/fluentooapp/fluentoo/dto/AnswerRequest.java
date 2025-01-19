package com.fluentooapp.fluentoo.dto;

import lombok.Data;

@Data
public class AnswerRequest {
    private Long flashcardId;
    private String answer;
    private boolean correct;

    public boolean getCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }
}