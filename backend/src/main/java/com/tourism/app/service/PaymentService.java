package com.tourism.app.service;

import com.tourism.app.dto.payment.PaymentRequest;
import com.tourism.app.dto.payment.PaymentResponse;

import java.util.List;

public interface PaymentService {
    PaymentResponse create(PaymentRequest request);
    PaymentResponse updateStatus(Long id, String status);
    List<PaymentResponse> getByBooking(Long bookingId);
}
