package com.tourism.app.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourism.app.entity.User;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BookingPaymentReviewIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Test
    void bookingPaymentReviewFlowShouldWorkForValidRoles() throws Exception {
        String hostEmail = "hostflow" + System.nanoTime() + "@example.com";
        String touristEmail = "touristflow" + System.nanoTime() + "@example.com";
        String password = "Pass@1234";

        signupUser("Flow Host", hostEmail, password, "HOST");
        signupUser("Flow Tourist", touristEmail, password, "TOURIST");

        Long hostId = getUserIdByEmail(hostEmail);
        Long touristId = getUserIdByEmail(touristEmail);

        String hostToken = loginAndGetToken(hostEmail, password);
        String touristToken = loginAndGetToken(touristEmail, password);

        Map<String, Object> homestayRequest = Map.of(
                "name", "Flow Homestay",
                "city", "Manali",
                "description", "Mountain stay",
                "pricePerNight", 3500.0,
                "hostId", hostId
        );

        MvcResult homestayResult = mockMvc.perform(post("/api/homestays")
                        .header("Authorization", "Bearer " + hostToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(homestayRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andReturn();

        Long homestayId = extractLongField(homestayResult, "id");

        Map<String, Object> bookingRequest = Map.of(
                "touristId", touristId,
                "homestayId", homestayId,
                "checkInDate", "2026-06-10",
                "checkOutDate", "2026-06-12"
        );

        MvcResult bookingResult = mockMvc.perform(post("/api/bookings")
                        .header("Authorization", "Bearer " + touristToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bookingRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn();

        Long bookingId = extractLongField(bookingResult, "id");

        Map<String, Object> paymentRequest = Map.of(
                "bookingId", bookingId,
                "amount", 7000.0,
                "method", "UPI",
                "status", "PAID"
        );

        mockMvc.perform(post("/api/payments")
                        .header("Authorization", "Bearer " + touristToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(paymentRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingId").value(bookingId))
                .andExpect(jsonPath("$.status").value("PAID"));

        Map<String, Object> reviewRequest = Map.of(
                "touristId", touristId,
                "homestayId", homestayId,
                "rating", 5,
                "comment", "Great stay"
        );

        mockMvc.perform(post("/api/reviews")
                        .header("Authorization", "Bearer " + touristToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.homestayId").value(homestayId))
                .andExpect(jsonPath("$.rating").value(5));

        mockMvc.perform(get("/api/reviews/homestay/{homestayId}", homestayId))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/payments/booking/{bookingId}", bookingId)
                        .header("Authorization", "Bearer " + touristToken))
                .andExpect(status().isOk());
    }

    @Test
    void touristShouldNotUpdateBookingStatus() throws Exception {
        String touristEmail = "touriststatus" + System.nanoTime() + "@example.com";
        String password = "Pass@1234";
        signupUser("Status Tourist", touristEmail, password, "TOURIST");
        String touristToken = loginAndGetToken(touristEmail, password);

        mockMvc.perform(patch("/api/bookings/{bookingId}/status", 1)
                        .param("status", "CONFIRMED")
                        .header("Authorization", "Bearer " + touristToken))
                .andExpect(status().isForbidden());
    }

    private Long getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
        return user.getId();
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

    private Long extractLongField(MvcResult result, String field) throws Exception {
        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.path(field).asLong();
    }
}
