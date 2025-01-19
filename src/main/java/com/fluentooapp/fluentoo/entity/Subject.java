package com.fluentooapp.fluentoo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "subjects", uniqueConstraints = {
		@UniqueConstraint(name = "uk_subject_name", columnNames = "name")
})
public class Subject {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Name is required")
	@Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
	@Column(nullable = false, length = 100)
	private String name;

	@NotBlank(message = "Description is required")
	@Size(max = 500, message = "Description must not exceed 500 characters")
	@Column(nullable = false, length = 500)
	private String description;
}
