package com.tourism.app.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourism.app.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RoleAuthorizationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Test
    void touristShouldNotCreateAttractionButHostShould() throws Exception {
        String touristEmail = "tourist" + System.nanoTime() + "@example.com";
        String hostEmail = "host" + System.nanoTime() + "@example.com";
        String password = "Pass@1234";

        signupUser("Tourist User", touristEmail, password, "TOURIST");
        signupUser("Host User", hostEmail, password, "HOST");

        String touristToken = loginAndGetToken(touristEmail, password);
        String hostToken = loginAndGetToken(hostEmail, password);

        Map<String, Object> attractionRequest = Map.of(
                "name", "City Palace",
                "city", "Jaipur",
                "category", "Heritage",
                "description", "Historic palace attraction"
        );

        mockMvc.perform(post("/api/attractions")
                        .header("Authorization", "Bearer " + touristToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(attractionRequest)))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/attractions")
                        .header("Authorization", "Bearer " + hostToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(attractionRequest)))
                .andExpect(status().isOk());
    }

    @Test
    void unauthenticatedProtectedCreateShouldRedirectToOauthLogin() throws Exception {
        Map<String, Object> request = Map.of(
                "name", "Unauthorized Attraction",
                "city", "Delhi",
                "category", "Museum",
                "description", "Should be blocked"
        );

        MvcResult result = mockMvc.perform(post("/api/attractions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isFound())
                .andReturn();

        String location = result.getResponse().getHeader("Location");
        assertNotNull(location);
        assertTrue(location.contains("oauth2/authorization/google"), "Unexpected redirect location: " + location);
    }

    private void signupUser(String fullName, String email, String password, String role) throws Exception {
        Map<String, Object> signupRequest = Map.of(
                "fullName", fullName,
                "email", email,
                "password", password,
                "role", role
        );

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk());

        assertTrue(userRepository.findByEmail(email).isPresent());
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        Map<String, Object> loginRequest = Map.of(
                "email", email,
                "password", password
        );

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode loginJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        return loginJson.path("accessToken").asText();
    }
}
