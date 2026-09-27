package com.campus.eventmanagement.dto;

import com.campus.eventmanagement.entity.EventCategory;
import com.campus.eventmanagement.entity.EventStatus;
import jakarta.validation.constraints.*;
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
public class EventRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private EventCategory category;

    @NotNull(message = "Event date is required")
    @FutureOrPresent(message = "Event date must be today or in the future")
    private LocalDate eventDate;

    @NotBlank(message = "Event time is required (e.g. 09:30)")
    private String eventTime;

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotBlank(message = "Organizer is required")
    private String organizer;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotNull(message = "Registration deadline is required")
    private LocalDateTime registrationDeadline;

    private String imageUrl;

    private EventStatus status;
}
