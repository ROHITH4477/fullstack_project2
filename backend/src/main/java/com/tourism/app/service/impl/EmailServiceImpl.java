package com.tourism.app.service.impl;

import com.tourism.app.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Override
    public void sendBookingConfirmation(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromAddress != null && !fromAddress.isBlank()) {
                message.setFrom(fromAddress);
            }
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Booking confirmation email sent successfully to {}", to);
        } catch (Exception ex) {
            log.error("Mail send failed for {}", to, ex);
        }
    }

    @Override
    public void sendBookingConfirmationWithReceipt(String to, String subject, String body, String receiptFileName, String receiptContent) {
        try {
            var mimeMessage = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(mimeMessage, true, StandardCharsets.UTF_8.name());
            if (fromAddress != null && !fromAddress.isBlank()) {
                helper.setFrom(fromAddress);
            }
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            helper.addAttachment(
                    receiptFileName,
                    new ByteArrayResource(receiptContent.getBytes(StandardCharsets.UTF_8)),
                    "text/plain"
            );
            mailSender.send(mimeMessage);
            log.info("Booking confirmation email with invoice sent successfully to {}", to);
        } catch (Exception ex) {
            log.error("Mail send with receipt failed for {}", to, ex);
        }
    }
}
