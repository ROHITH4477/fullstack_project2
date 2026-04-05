package com.tourism.app.service.impl;

import com.tourism.app.dto.payment.PaymentRequest;
import com.tourism.app.dto.payment.PaymentResponse;
import com.tourism.app.entity.Booking;
import com.tourism.app.entity.Payment;
import com.tourism.app.entity.enums.BookingStatus;
import com.tourism.app.exception.ResourceNotFoundException;
import com.tourism.app.repository.BookingRepository;
import com.tourism.app.repository.PaymentRepository;
import com.tourism.app.service.EmailService;
import com.tourism.app.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public PaymentResponse create(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(request.getAmount())
                .method(request.getMethod())
                .status(request.getStatus())
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        sendPaymentSuccessEmailIfPaid(savedPayment);
        return toResponse(savedPayment);
    }

    @Override
    @Transactional
    public PaymentResponse updateStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        boolean wasPaid = isPaidStatus(payment.getStatus());
        payment.setStatus(status);
        Payment savedPayment = paymentRepository.save(payment);

        if (!wasPaid && isPaidStatus(savedPayment.getStatus())) {
            sendPaymentSuccessEmailIfPaid(savedPayment);
        }

        return toResponse(savedPayment);
    }

    @Override
    public List<PaymentResponse> getByBooking(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private boolean isPaidStatus(String status) {
        return status != null && "PAID".equalsIgnoreCase(status.trim());
    }

    private void sendPaymentSuccessEmailIfPaid(Payment payment) {
        if (!isPaidStatus(payment.getStatus())) {
            return;
        }

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        String touristEmail = booking.getTourist().getEmail();
        String touristName = booking.getTourist().getFullName();
        String homestayName = booking.getHomestay().getName();

        String subject = "Booking Confirmed - Payment Successful";
        String body = "Hi " + touristName + ",\n\n"
                + "Your payment was successful and your booking is now confirmed.\n\n"
                + "Booking details\n"
                + "Booking ID: " + booking.getId() + "\n"
                + "Property: " + homestayName + "\n"
                + "Check-in: " + booking.getCheckInDate() + "\n"
                + "Check-out: " + booking.getCheckOutDate() + "\n"
                + "Booking status: " + booking.getStatus().name().toUpperCase(Locale.ROOT) + "\n\n"
                + "Payment details\n"
                + "Payment ID: " + payment.getId() + "\n"
                + "Amount paid: INR " + payment.getAmount() + "\n"
                + "Method: " + payment.getMethod() + "\n"
                + "Paid at: " + payment.getPaidAt() + "\n\n"
                + "Your invoice is attached with this email.\n\n"
                + "Thanks,\nStayVista India";

        String receiptFileName = "invoice-booking-" + booking.getId() + ".txt";
        String receiptContent = "StayVista India - Booking Invoice\n"
                + "----------------------------------\n"
                + "Invoice Date: " + payment.getPaidAt() + "\n"
                + "Invoice Number: SV-INV-" + booking.getId() + "-" + payment.getId() + "\n"
                + "Payment ID: " + payment.getId() + "\n"
                + "Booking ID: " + booking.getId() + "\n"
                + "Guest Name: " + touristName + "\n"
                + "Guest Email: " + touristEmail + "\n"
                + "Homestay: " + homestayName + "\n"
                + "Check-In: " + booking.getCheckInDate() + "\n"
                + "Check-Out: " + booking.getCheckOutDate() + "\n"
                + "Booking Status: " + booking.getStatus().name() + "\n"
                + "Amount Paid: " + payment.getAmount() + "\n"
                + "Payment Method: " + payment.getMethod() + "\n"
                + "Payment Status: " + payment.getStatus() + "\n"
                + "\n"
                + "Thank you for booking with StayVista India.\n";

        emailService.sendBookingConfirmationWithReceipt(
                touristEmail,
                subject,
                body,
                receiptFileName,
                receiptContent
        );
    }

    private PaymentResponse toResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setBookingId(payment.getBooking().getId());
        response.setAmount(payment.getAmount());
        response.setMethod(payment.getMethod());
        response.setStatus(payment.getStatus());
        response.setPaidAt(payment.getPaidAt());
        return response;
    }
}
