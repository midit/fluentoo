package com.fluentooapp.fluentoo.controller;

import com.fluentooapp.fluentoo.dto.AuthResponse;
import com.fluentooapp.fluentoo.dto.LoginRequest;
import com.fluentooapp.fluentoo.dto.UserDto;
import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.service.UserService;
import com.fluentooapp.fluentoo.exception.BadRequestException;
import com.fluentooapp.fluentoo.exception.UnauthorizedException;
import com.fluentooapp.fluentoo.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthRestController {

    private static final Logger logger = LoggerFactory.getLogger(AuthRestController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login attempt for user: {}", loginRequest.getEmail());
            AuthResponse response = authService.login(loginRequest);
            logger.info("Login successful for user: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            logger.warn("Login failed - invalid credentials for user: {}", loginRequest.getEmail());
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid credentials. Please try again.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            logger.error("Login error for user {}: {}", loginRequest.getEmail(), e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "An error occurred during login. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDto userDto) {
        try {
            logger.info("Attempting to register user with email: {}", userDto.getEmail());

            if (userService.existsByEmail(userDto.getEmail())) {
                logger.warn("Registration failed - email already exists: {}", userDto.getEmail());
                throw new BadRequestException("Email already exists");
            }

            // Save user and use it for login
            User savedUser = userService.saveUser(userDto);
            logger.info("Successfully registered user with email: {}", savedUser.getEmail());

            // Return AuthResponse with the saved user's credentials
            AuthResponse response = authService.login(new LoginRequest(savedUser.getEmail(), userDto.getPassword()));
            return ResponseEntity.ok(response);
        } catch (BadRequestException e) {
            logger.warn("Registration failed with BadRequestException", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            logger.error("Registration failed with unexpected error", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            User user = authService.getCurrentUser();
            if (user == null) {
                throw new UnauthorizedException("User not authenticated");
            }
            UserDto userDto = new UserDto(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
            return ResponseEntity.ok(userDto);
        } catch (UnauthorizedException e) {
            logger.warn("Unauthorized access attempt to /me endpoint");
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            logger.error("Error getting current user", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error retrieving user information");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}