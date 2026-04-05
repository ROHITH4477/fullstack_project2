package com.tourism.app.dto.user;

import lombok.Data;

import java.util.Set;

@Data
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private Set<String> roles;
}
