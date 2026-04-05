package com.tourism.app.repository;

import com.tourism.app.entity.Booking;
import com.tourism.app.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTouristId(Long touristId);
    long countByStatus(BookingStatus status);
    long deleteByStatus(BookingStatus status);
}
