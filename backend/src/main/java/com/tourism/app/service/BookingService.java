package com.tourism.app.service;

import com.tourism.app.dto.booking.BookingRequest;
import com.tourism.app.dto.booking.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse create(BookingRequest request);
    List<BookingResponse> getBookingsByTourist(Long touristId);
    BookingResponse updateStatus(Long bookingId, String status);
    long countByStatus(String status);
    long deleteByStatus(String status);
}
