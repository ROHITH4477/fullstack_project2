package com.tourism.app.dto.review;

import lombok.Data;

@Data
public class ReviewResponse {
    private Long id;
    private Long touristId;
    private Long homestayId;
    private Integer rating;
    private String comment;
}
