package com.tourism.app.dto.attraction;

import lombok.Data;

@Data
public class AttractionResponse {
    private Long id;
    private String name;
    private String city;
    private String category;
    private String description;
}
