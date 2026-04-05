package com.tourism.app.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityAccessIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void publicHealthAndHomestayReadEndpointsShouldBeAccessible() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));

        mockMvc.perform(get("/api/homestays"))
                .andExpect(status().isOk());
    }

    @Test
    void createHomestayWithoutAuthShouldBeRejected() throws Exception {
        Map<String, Object> request = Map.of(
                "name", "Unauthorized Test Home",
                "city", "Delhi",
                "description", "Should be blocked",
                "pricePerNight", 1999.0,
                "hostId", 1
        );

        MvcResult result = mockMvc.perform(post("/api/homestays")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        int status = result.getResponse().getStatus();
                assertTrue(status == 401 || status == 403 || status == 302, "Expected 401/403/302, got " + status);
                if (status == 302) {
                        String location = result.getResponse().getHeader("Location");
                        assertNotNull(location);
                        assertTrue(location.contains("oauth2/authorization/google"), "Unexpected redirect location: " + location);
                }
    }
}
