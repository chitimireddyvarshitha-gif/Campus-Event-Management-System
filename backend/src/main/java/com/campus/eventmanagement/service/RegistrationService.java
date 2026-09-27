package com.campus.eventmanagement.service;

import com.campus.eventmanagement.dto.RegistrationResponse;
import com.campus.eventmanagement.entity.*;
import com.campus.eventmanagement.exception.BadRequestException;
import com.campus.eventmanagement.exception.ConflictException;
import com.campus.eventmanagement.exception.ResourceNotFoundException;
import com.campus.eventmanagement.repository.EventRepository;
import com.campus.eventmanagement.repository.RegistrationRepository;
import com.campus.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public RegistrationResponse registerStudentForEvent(Long studentId, Long eventId) {
        // 1. Verify student exists
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student user not found with ID: " + studentId));

        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students are eligible to register for campus events");
        }

        // 2. Verify event exists
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        // 3. Verify event is not cancelled
        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BadRequestException("Event has been cancelled. Registrations are not allowed.");
        }

        // 4. Verify registration deadline has not passed
        if (LocalDateTime.now().isAfter(event.getRegistrationDeadline())) {
            throw new BadRequestException("Registration deadline has passed for this event");
        }

        // 5. Count current active registrations
        long activeCount = registrationRepository.countByEventIdAndStatus(eventId, RegistrationStatus.REGISTERED);

        // 6. Verify capacity has not been reached
        if (activeCount >= event.getCapacity()) {
            throw new ConflictException("Event is full. Capacity has been reached.");
        }

        // 7. Check if student already registered
        Optional<Registration> existingOpt = registrationRepository.findByStudentIdAndEventId(studentId, eventId);
        if (existingOpt.isPresent()) {
            Registration existing = existingOpt.get();
            if (existing.getStatus() == RegistrationStatus.REGISTERED) {
                throw new ConflictException("You are already registered for this event");
            } else {
                // Reactivate cancelled registration
                existing.setStatus(RegistrationStatus.REGISTERED);
                existing.setRegistrationDate(LocalDateTime.now());
                Registration updated = registrationRepository.save(existing);
                return mapToRegistrationResponse(updated);
            }
        }

        // 8. Create new registration
        Registration registration = Registration.builder()
                .student(student)
                .event(event)
                .status(RegistrationStatus.REGISTERED)
                .build();

        Registration saved = registrationRepository.save(registration);
        return mapToRegistrationResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getStudentRegistrations(Long studentId, Long authenticatedUserId, Role authenticatedRole) {
        // Verify authorization: student can only view their own registrations, unless faculty/admin
        if (authenticatedRole == Role.STUDENT && !studentId.equals(authenticatedUserId)) {
            throw new AccessDeniedException("Unauthorized to view other students' registrations");
        }

        List<Registration> registrations = registrationRepository.findByStudentIdWithEvent(studentId);
        return registrations.stream()
                .map(this::mapToRegistrationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RegistrationResponse cancelRegistration(Long registrationId, Long authenticatedUserId, Role authenticatedRole) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found with ID: " + registrationId));

        // Must belong to authenticated student or be admin
        if (authenticatedRole == Role.STUDENT && !registration.getStudent().getId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("You can only cancel your own registrations");
        }

        if (registration.getStatus() == RegistrationStatus.CANCELLED) {
            throw new BadRequestException("Registration is already cancelled");
        }

        registration.setStatus(RegistrationStatus.CANCELLED);
        Registration updated = registrationRepository.save(registration);

        return mapToRegistrationResponse(updated);
    }

    public RegistrationResponse mapToRegistrationResponse(Registration r) {
        return RegistrationResponse.builder()
                .id(r.getId())
                .studentId(r.getStudent().getId())
                .studentName(r.getStudent().getName())
                .studentEmail(r.getStudent().getEmail())
                .studentPhone(r.getStudent().getPhone())
                .eventId(r.getEvent().getId())
                .eventTitle(r.getEvent().getTitle())
                .eventCategory(r.getEvent().getCategory())
                .eventDate(r.getEvent().getEventDate())
                .eventTime(r.getEvent().getEventTime())
                .venue(r.getEvent().getVenue())
                .registrationDate(r.getRegistrationDate())
                .status(r.getStatus())
                .build();
    }
}
