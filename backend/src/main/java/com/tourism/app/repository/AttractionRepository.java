package com.tourism.app.repository;

import com.tourism.app.entity.Attraction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttractionRepository extends JpaRepository<Attraction, Long> {
    List<Attraction> findByCityIgnoreCase(String city);
    List<Attraction> findByCategoryIgnoreCase(String category);
}
