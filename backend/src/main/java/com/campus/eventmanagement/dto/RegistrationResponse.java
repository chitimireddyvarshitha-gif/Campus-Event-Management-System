package com.campus.eventmanagement.dto;

import com.campus.eventmanagement.entity.EventCategory;
import com.campus.eventmanagement.entity.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentPhone;
    private Long eventId;
    private String eventTitle;
    private EventCategory eventCategory;
    private LocalDate eventDate;
    private String eventTime;
    private String venue;
    private LocalDateTime registrationDate;
    private RegistrationStatus status;
}
