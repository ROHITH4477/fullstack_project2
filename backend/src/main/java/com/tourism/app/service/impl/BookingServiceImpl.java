package com.tourism.app.service.impl;

import com.tourism.app.dto.booking.BookingRequest;
import com.tourism.app.dto.booking.BookingResponse;
import com.tourism.app.entity.Booking;
import com.tourism.app.entity.Homestay;
import com.tourism.app.entity.User;
import com.tourism.app.entity.enums.BookingStatus;
import com.tourism.app.exception.BadRequestException;
import com.tourism.app.exception.ResourceNotFoundException;
import com.tourism.app.repository.BookingRepository;
import com.tourism.app.repository.HomestayRepository;
import com.tourism.app.repository.UserRepository;
import com.tourism.app.service.BookingService;
import com.tourism.app.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final HomestayRepository homestayRepository;
    private final EmailService emailService;
    private final ModelMapper modelMapper;

    @Override
    public BookingResponse create(BookingRequest request, String authenticatedEmail) {
        if (request.getCheckOutDate().isBefore(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date cannot be before check-in date");
        }

        User tourist = userRepository.findByEmail(authenticatedEmail)
                .orElseGet(() -> userRepository.findById(request.getTouristId())
                        .orElseThrow(() -> new ResourceNotFoundException("Tourist not found")));

        Homestay homestay = homestayRepository.findById(request.getHomestayId())
                .orElseThrow(() -> new ResourceNotFoundException("Homestay not found"));

        Booking booking = Booking.builder()
                .tourist(tourist)
                .homestay(homestay)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);

        emailService.sendBookingConfirmation(
                tourist.getEmail(),
                "Booking Created - " + homestay.getName(),
                "Hi " + tourist.getFullName() + ",\n\n"
                        + "Your booking request has been created successfully.\n\n"
                        + "Booking details\n"
                        + "Booking ID: " + saved.getId() + "\n"
                        + "Property: " + homestay.getName() + "\n"
                        + "Location: " + homestay.getCity() + "\n"
                        + "Check-in: " + saved.getCheckInDate() + "\n"
                        + "Check-out: " + saved.getCheckOutDate() + "\n"
                        + "Status: " + saved.getStatus().name().toUpperCase(Locale.ROOT) + "\n\n"
                        + "Complete payment to receive your final invoice and confirmation email.\n\n"
                        + "Thanks,\nStayVista India"
        );

        return toResponse(saved);
    }

    @Override
    public List<BookingResponse> getBookingsByTourist(Long touristId) {
        return bookingRepository.findByTouristId(touristId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public BookingResponse updateStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus(BookingStatus.valueOf(status.toUpperCase()));
        return toResponse(bookingRepository.save(booking));
    }

    @Override
    public long countByStatus(String status) {
        return bookingRepository.countByStatus(BookingStatus.valueOf(status.toUpperCase()));
    }

    @Override
    public long deleteByStatus(String status) {
        return bookingRepository.deleteByStatus(BookingStatus.valueOf(status.toUpperCase()));
    }

    private BookingResponse toResponse(Booking booking) {
        BookingResponse response = modelMapper.map(booking, BookingResponse.class);
        response.setTouristId(booking.getTourist().getId());
        response.setHomestayId(booking.getHomestay().getId());
        response.setHomestayName(booking.getHomestay().getName());
        response.setStatus(booking.getStatus().name());
        return response;
    }
}
