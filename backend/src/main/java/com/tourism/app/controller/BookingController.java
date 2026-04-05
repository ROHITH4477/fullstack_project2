package com.tourism.app.controller;

import com.tourism.app.dto.booking.BookingRequest;
import com.tourism.app.dto.booking.BookingResponse;
import com.tourism.app.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @Operation(summary = "Create booking")
    @PreAuthorize("hasAnyRole('TOURIST','ADMIN')")
    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest request, Authentication authentication) {
        return ResponseEntity.ok(bookingService.create(request, authentication.getName()));
    }

    @Operation(summary = "Get bookings for tourist")
    @PreAuthorize("hasAnyRole('TOURIST','ADMIN')")
    @GetMapping("/tourist/{touristId}")
    public ResponseEntity<List<BookingResponse>> getByTourist(@PathVariable Long touristId) {
        return ResponseEntity.ok(bookingService.getBookingsByTourist(touristId));
    }

    @Operation(summary = "Update booking status")
    @PreAuthorize("hasAnyRole('ADMIN','HOST')")
    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponse> updateStatus(@PathVariable Long bookingId, @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateStatus(bookingId, status));
    }

    @Operation(summary = "Count bookings by status")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/count")
    public ResponseEntity<Long> countByStatus(@RequestParam String status) {
        return ResponseEntity.ok(bookingService.countByStatus(status));
    }

    @Operation(summary = "Delete bookings by status")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public ResponseEntity<Long> deleteByStatus(@RequestParam String status) {
        return ResponseEntity.ok(bookingService.deleteByStatus(status));
    }
}
