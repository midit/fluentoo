package com.fluentooapp.fluentoo.entity;

public enum GameType {
    FLASHCARD("flashcard"),
    MATCHING("matching");

    private final String value;

    GameType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}