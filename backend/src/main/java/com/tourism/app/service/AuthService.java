package com.tourism.app.service;

import com.tourism.app.dto.auth.AuthResponse;
import com.tourism.app.dto.auth.LoginRequest;
import com.tourism.app.dto.auth.SignupRequest;

public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
}
