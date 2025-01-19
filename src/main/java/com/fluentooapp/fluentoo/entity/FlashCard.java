package com.fluentooapp.fluentoo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "flashcards")
public class FlashCard {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Question is required")
	@Column(columnDefinition = "TEXT", nullable = false)
	private String question;

	@NotBlank(message = "Answer is required")
	@Column(columnDefinition = "TEXT", nullable = false)
	private String answer;

	@JsonBackReference
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deck_id")
	private Deck deck;

	@Min(1)
	@Max(5)
	@Column(name = "envelope_nb")
	private int envelopeNb = 1;

	@Column(name = "revision_time")
	private LocalDateTime revisionTime;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
	}

	public boolean checkAnswer(String answer) {
		return this.answer.trim().equalsIgnoreCase(answer.trim());
	}
}
