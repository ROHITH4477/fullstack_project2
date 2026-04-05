package com.tourism.app.repository;

import com.tourism.app.entity.Guide;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuideRepository extends JpaRepository<Guide, Long> {
    List<Guide> findByCityIgnoreCase(String city);
    List<Guide> findByLanguageIgnoreCase(String language);
}
