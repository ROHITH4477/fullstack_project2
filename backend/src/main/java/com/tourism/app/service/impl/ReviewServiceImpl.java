package com.tourism.app.service.impl;

import com.tourism.app.dto.review.ReviewRequest;
import com.tourism.app.dto.review.ReviewResponse;
import com.tourism.app.entity.Homestay;
import com.tourism.app.entity.Review;
import com.tourism.app.entity.User;
import com.tourism.app.exception.ResourceNotFoundException;
import com.tourism.app.repository.HomestayRepository;
import com.tourism.app.repository.ReviewRepository;
import com.tourism.app.repository.UserRepository;
import com.tourism.app.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final HomestayRepository homestayRepository;

    @Override
    public ReviewResponse create(ReviewRequest request) {
        User tourist = userRepository.findById(request.getTouristId())
                .orElseThrow(() -> new ResourceNotFoundException("Tourist not found"));
        Homestay homestay = homestayRepository.findById(request.getHomestayId())
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found"));

        Review review = Review.builder()
                .tourist(tourist)
                .homestay(homestay)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    @Override
    public List<ReviewResponse> getByHomestay(Long homestayId) {
        return reviewRepository.findByHomestayId(homestayId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setTouristId(review.getTourist().getId());
        response.setHomestayId(review.getHomestay().getId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        return response;
    }
}
