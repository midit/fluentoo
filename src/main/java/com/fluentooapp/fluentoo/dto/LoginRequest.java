package com.fluentooapp.fluentoo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotEmpty(message = "Email should not be empty")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotEmpty(message = "Password should not be empty")
    private String password;
}