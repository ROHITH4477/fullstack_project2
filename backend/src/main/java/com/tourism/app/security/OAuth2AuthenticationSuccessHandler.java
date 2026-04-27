package com.tourism.app.security;

import com.tourism.app.entity.Role;
import com.tourism.app.entity.RefreshToken;
import com.tourism.app.entity.User;
import com.tourism.app.entity.enums.RoleName;
import com.tourism.app.repository.RefreshTokenRepository;
import com.tourism.app.repository.RoleRepository;
import com.tourism.app.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        Role touristRole = roleRepository.findByName(RoleName.ROLE_TOURIST)
                .orElseThrow(() -> new IllegalStateException("Default role missing"));

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(email)
                        .fullName(name == null ? "OAuth User" : name)
                        .password("oauth2_user")
                        .provider("google")
                        .enabled(true)
                        .roles(Collections.singleton(touristRole))
                        .build()));

        String accessToken = jwtService.generateToken(email);
        String refreshToken = createRefreshToken(user);
        String primaryFrontendUrl = resolvePrimaryFrontendUrl();
        String role = user.getRoles().stream()
                .findFirst()
                .map(savedRole -> savedRole.getName().name())
                .orElse(RoleName.ROLE_TOURIST.name());

        String targetUrl = UriComponentsBuilder.fromUriString(primaryFrontendUrl + "/#/oauth2/success")
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .queryParam("id", user.getId())
                .queryParam("email", user.getEmail())
                .queryParam("fullName", user.getFullName())
                .queryParam("role", role)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String resolvePrimaryFrontendUrl() {
        java.util.List<String> urls = java.util.Arrays.stream(frontendUrl.split(","))
                .map(String::trim)
                .filter(url -> !url.isEmpty())
                .toList();

        return urls.stream()
                .filter(url -> !url.contains("localhost") && !url.contains("127.0.0.1"))
                .findFirst()
                .orElseGet(() -> urls.stream().findFirst().orElse("http://localhost:5173"));
    }

    private String createRefreshToken(User user) {
        refreshTokenRepository.deleteByUserId(user.getId());

        RefreshToken token = RefreshToken.builder()
                .token(UUID.randomUUID().toString() + UUID.randomUUID())
                .user(user)
                .expiresAt(LocalDateTime.now().plusNanos(refreshExpirationMs * 1_000_000))
                .revoked(false)
                .build();

        refreshTokenRepository.save(token);
        return token.getToken();
    }
}
