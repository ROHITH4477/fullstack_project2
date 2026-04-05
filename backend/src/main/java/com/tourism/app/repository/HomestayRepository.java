package com.tourism.app.repository;

import com.tourism.app.entity.Homestay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface HomestayRepository extends JpaRepository<Homestay, Long> {
    List<Homestay> findByCityIgnoreCase(String city);
    List<Homestay> findByPricePerNightBetween(BigDecimal min, BigDecimal max);

    @Query("SELECT h FROM Homestay h WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(h.city) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Homestay> search(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT AVG(h.pricePerNight) FROM Homestay h")
    BigDecimal averagePrice();
}
