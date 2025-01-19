package com.fluentooapp.fluentoo.service;

import com.fluentooapp.fluentoo.dto.AuthResponse;
import com.fluentooapp.fluentoo.dto.LoginRequest;
import com.fluentooapp.fluentoo.entity.User;

public interface AuthService {
    AuthResponse login(LoginRequest loginRequest);

    User getCurrentUser();
}