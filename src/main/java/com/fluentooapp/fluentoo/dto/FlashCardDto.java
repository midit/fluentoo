package com.fluentooapp.fluentoo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FlashCardDto {
	private Long id;

	@NotBlank(message = "Question is required")
	private String question;

	@NotBlank(message = "Answer is required")
	private String answer;

	@NotNull(message = "Deck ID is required")
	private Long deckId;
}
