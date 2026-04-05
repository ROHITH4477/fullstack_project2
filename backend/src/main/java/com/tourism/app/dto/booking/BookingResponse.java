package com.tourism.app.dto.booking;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingResponse {
    private Long id;
    private Long touristId;
    private Long homestayId;
    private String homestayName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String status;
}
