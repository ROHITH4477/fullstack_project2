package com.tourism.app.repository;

import com.tourism.app.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByHomestayId(Long homestayId);
    List<Review> findByTouristId(Long touristId);
}
