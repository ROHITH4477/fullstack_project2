package com.tourism.app.service;

import com.tourism.app.dto.review.ReviewRequest;
import com.tourism.app.dto.review.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse create(ReviewRequest request);
    List<ReviewResponse> getByHomestay(Long homestayId);
    void delete(Long id);
}
