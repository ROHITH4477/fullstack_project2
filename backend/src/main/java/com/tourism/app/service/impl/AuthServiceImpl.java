package com.tourism.app.service.impl;

import com.tourism.app.dto.auth.AuthResponse;
import com.tourism.app.dto.auth.LoginRequest;
import com.tourism.app.dto.auth.SignupRequest;
import com.tourism.app.entity.RefreshToken;
import com.tourism.app.entity.Role;
import com.tourism.app.entity.User;
import com.tourism.app.entity.enums.RoleName;
import com.tourism.app.exception.BadRequestException;
import com.tourism.app.repository.RefreshTokenRepository;
import com.tourism.app.repository.RoleRepository;
import com.tourism.app.repository.UserRepository;
import com.tourism.app.security.JwtService;
import com.tourism.app.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    @Override
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        RoleName roleName = parseRole(request.getRole());
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new BadRequestException("Role not found: " + roleName));

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .provider("local")
                .enabled(true)
                .roles(Collections.singleton(role))
                .build();

        userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail());
        String refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .id(user.getId())
                .accessToken(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(toRoleNames(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        String token = jwtService.generateToken(user.getEmail());
        String refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .id(user.getId())
                .accessToken(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(toRoleNames(user))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
            .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (storedToken.isRevoked() || storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Refresh token expired or revoked");
        }

        User user = storedToken.getUser();
        String accessToken = jwtService.generateToken(user.getEmail());

        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);
        String rotatedRefreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .id(user.getId())
                .accessToken(accessToken)
                .refreshToken(rotatedRefreshToken)
                .tokenType("Bearer")
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(toRoleNames(user))
                .build();
    }

    private String createRefreshToken(User user) {
        refreshTokenRepository.deleteByUserId(user.getId());
        String value = UUID.randomUUID().toString() + UUID.randomUUID();
        RefreshToken token = RefreshToken.builder()
            .token(value)
            .user(user)
            .expiresAt(LocalDateTime.now().plusNanos(refreshExpirationMs * 1_000_000))
            .revoked(false)
            .build();
        refreshTokenRepository.save(token);
        return value;
    }

    private RoleName parseRole(String roleValue) {
        if (roleValue == null || roleValue.isBlank()) {
            return RoleName.ROLE_TOURIST;
        }

        String normalized = roleValue.toUpperCase();
        if (!normalized.startsWith("ROLE_")) {
            normalized = "ROLE_" + normalized;
        }

        try {
            return RoleName.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid role: " + roleValue);
        }
    }

    private Set<String> toRoleNames(User user) {
        return user.getRoles()
                .stream()
                .map(role -> role.getName().name())
                .collect(java.util.stream.Collectors.toSet());
    }
}
