package com.tourism.app.dto.homestay;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class HomestayResponse {
    private Long id;
    private String name;
    private String city;
    private String description;
    private BigDecimal pricePerNight;
    private String imageUrl;
    private Long hostId;
}
