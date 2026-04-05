package com.tourism.app.dto.guide;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GuideResponse {
    private Long id;
    private String fullName;
    private String email;
    private String city;
    private String language;
    private BigDecimal pricePerDay;
}
