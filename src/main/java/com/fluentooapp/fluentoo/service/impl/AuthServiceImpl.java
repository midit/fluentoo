package com.fluentooapp.fluentoo.service.impl;

import com.fluentooapp.fluentoo.dto.AuthResponse;
import com.fluentooapp.fluentoo.dto.LoginRequest;
import com.fluentooapp.fluentoo.entity.User;
import com.fluentooapp.fluentoo.service.AuthService;
import com.fluentooapp.fluentoo.service.UserService;
import com.fluentooapp.fluentoo.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            logger.debug("Attempting to authenticate user: {}", loginRequest.getEmail());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            User user = userService.findUserByEmail(loginRequest.getEmail());
            String jwt = jwtUtil.generateToken(user);

            logger.debug("Successfully authenticated user: {}", loginRequest.getEmail());
            return AuthResponse.fromUser(jwt, user);
        } catch (Exception e) {
            logger.error("Authentication failed for user {}: {}", loginRequest.getEmail(), e.getMessage());
            throw e;
        }
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return userService.findUserByEmail(authentication.getName());
    }
}