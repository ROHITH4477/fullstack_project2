package com.tourism.app.service;

public interface EmailService {
    void sendBookingConfirmation(String to, String subject, String body);

    void sendBookingConfirmationWithReceipt(
            String to,
            String subject,
            String body,
            String receiptFileName,
            String receiptContent
    );
}
