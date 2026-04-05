package com.tourism.app.controller;

import com.tourism.app.dto.review.ReviewRequest;
import com.tourism.app.dto.review.ReviewResponse;
import com.tourism.app.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "Create review")
    @PreAuthorize("hasAnyRole('TOURIST','ADMIN')")
    @PostMapping
    public ResponseEntity<ReviewResponse> create(@Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.create(request));
    }

    @Operation(summary = "Get reviews by homestay")
    @GetMapping("/homestay/{homestayId}")
    public ResponseEntity<List<ReviewResponse>> getByHomestay(@PathVariable Long homestayId) {
        return ResponseEntity.ok(reviewService.getByHomestay(homestayId));
    }

    @Operation(summary = "Delete review")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
