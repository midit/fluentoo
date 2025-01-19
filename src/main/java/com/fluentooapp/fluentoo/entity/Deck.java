package com.fluentooapp.fluentoo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "decks", indexes = {
		@Index(name = "idx_deck_name", columnList = "name"),
		@Index(name = "idx_deck_subject", columnList = "subject_id"),
		@Index(name = "idx_deck_creator", columnList = "created_by")
})
public class Deck {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Name is required")
	@Column(nullable = false)
	private String name;

	@Column(columnDefinition = "TEXT")
	private String description;

	@NotNull(message = "Subject is required")
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "subject_id", nullable = false)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private Subject subject;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "created_by", nullable = false)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "decks", "password", "userStats" })
	private User createdBy;

	@OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnoreProperties("deck")
	private List<FlashCard> flashCards = new ArrayList<>();

	@Column(name = "is_public")
	private boolean isPublic;

	@Min(0)
	@Column(name = "launch_count", nullable = false)
	private int launchCount = 0;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

	public void incrementLaunchCount() {
		this.launchCount++;
	}
}
