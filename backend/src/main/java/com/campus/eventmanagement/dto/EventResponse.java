package com.campus.eventmanagement.dto;

import com.campus.eventmanagement.entity.EventCategory;
import com.campus.eventmanagement.entity.EventStatus;
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
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private EventCategory category;
    private LocalDate eventDate;
    private String eventTime;
    private String venue;
    private String organizer;
    private Integer capacity;
    private LocalDateTime registrationDeadline;
    private String imageUrl;
    private EventStatus status;
    private long registeredCount;
    private long availableSeats;
    private boolean isRegistered;
    private Long userRegistrationId;
    private LocalDateTime createdAt;
}
