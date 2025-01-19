package com.fluentooapp.fluentoo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeckDto {
	@NotBlank(message = "Name is required")
	private String name;

	private String description;

	@NotNull(message = "Subject is required")
	private Long subjectId;

	private boolean public_;
}
