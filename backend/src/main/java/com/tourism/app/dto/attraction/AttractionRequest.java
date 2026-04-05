package com.tourism.app.dto.attraction;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AttractionRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String city;

    @NotBlank
    private String category;

    @NotBlank
    private String description;
}
