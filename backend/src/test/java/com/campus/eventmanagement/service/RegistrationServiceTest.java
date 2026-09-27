package com.campus.eventmanagement.service;

import com.campus.eventmanagement.dto.RegistrationResponse;
import com.campus.eventmanagement.entity.*;
import com.campus.eventmanagement.exception.BadRequestException;
import com.campus.eventmanagement.exception.ConflictException;
import com.campus.eventmanagement.exception.ResourceNotFoundException;
import com.campus.eventmanagement.repository.EventRepository;
import com.campus.eventmanagement.repository.RegistrationRepository;
import com.campus.eventmanagement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RegistrationServiceTest {

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RegistrationService registrationService;

    private User student;
    private Event event;

    @BeforeEach
    void setUp() {
        student = User.builder()
                .id(1L)
                .name("Alex Rivera")
                .email("student1@college.edu")
                .role(Role.STUDENT)
                .phone("555-0101")
                .build();

        event = Event.builder()
                .id(10L)
                .title("HackCampus 2026")
                .description("AI Hackathon")
                .category(EventCategory.TECHNICAL)
                .eventDate(LocalDate.now().plusDays(10))
                .eventTime("09:00")
                .venue("Main Lab")
                .organizer("ACM")
                .capacity(50)
                .registrationDeadline(LocalDateTime.now().plusDays(5))
                .status(EventStatus.UPCOMING)
                .build();
    }

    @Test
    @DisplayName("Should successfully register student for an eligible event")
    void testSuccessfulRegistration() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(eventRepository.findById(10L)).thenReturn(Optional.of(event));
        when(registrationRepository.countByEventIdAndStatus(10L, RegistrationStatus.REGISTERED)).thenReturn(10L);
        when(registrationRepository.findByStudentIdAndEventId(1L, 10L)).thenReturn(Optional.empty());

        Registration savedReg = Registration.builder()
                .id(100L)
                .student(student)
                .event(event)
                .registrationDate(LocalDateTime.now())
                .status(RegistrationStatus.REGISTERED)
                .build();

        when(registrationRepository.save(any(Registration.class))).thenReturn(savedReg);

        RegistrationResponse response = registrationService.registerStudentForEvent(1L, 10L);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("HackCampus 2026", response.getEventTitle());
        assertEquals(RegistrationStatus.REGISTERED, response.getStatus());
        verify(registrationRepository, times(1)).save(any(Registration.class));
    }

    @Test
    @DisplayName("Should throw ConflictException on duplicate active registration")
    void testDuplicateRegistration() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(eventRepository.findById(10L)).thenReturn(Optional.of(event));
        when(registrationRepository.countByEventIdAndStatus(10L, RegistrationStatus.REGISTERED)).thenReturn(5L);

        Registration existingReg = Registration.builder()
                .id(101L)
                .student(student)
                .event(event)
                .status(RegistrationStatus.REGISTERED)
                .build();

        when(registrationRepository.findByStudentIdAndEventId(1L, 10L)).thenReturn(Optional.of(existingReg));

        assertThrows(ConflictException.class, () -> registrationService.registerStudentForEvent(1L, 10L));
        verify(registrationRepository, never()).save(any(Registration.class));
    }

    @Test
    @DisplayName("Should throw ConflictException when event capacity is full")
    void testFullEventRegistration() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(eventRepository.findById(10L)).thenReturn(Optional.of(event));
        // event capacity is 50, active count is 50
        when(registrationRepository.countByEventIdAndStatus(10L, RegistrationStatus.REGISTERED)).thenReturn(50L);

        assertThrows(ConflictException.class, () -> registrationService.registerStudentForEvent(1L, 10L));
    }

    @Test
    @DisplayName("Should throw BadRequestException when registration deadline has passed")
    void testDeadlinePassedRegistration() {
        event.setRegistrationDeadline(LocalDateTime.now().minusHours(2));
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(eventRepository.findById(10L)).thenReturn(Optional.of(event));

        assertThrows(BadRequestException.class, () -> registrationService.registerStudentForEvent(1L, 10L));
    }

    @Test
    @DisplayName("Should throw BadRequestException when event is cancelled")
    void testCancelledEventRegistration() {
        event.setStatus(EventStatus.CANCELLED);
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(eventRepository.findById(10L)).thenReturn(Optional.of(event));

        assertThrows(BadRequestException.class, () -> registrationService.registerStudentForEvent(1L, 10L));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException for invalid event ID")
    void testInvalidEventRegistration() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(student));
        when(eventRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> registrationService.registerStudentForEvent(1L, 999L));
    }

    @Test
    @DisplayName("Should successfully cancel an existing active registration")
    void testCancelRegistration() {
        Registration reg = Registration.builder()
                .id(200L)
                .student(student)
                .event(event)
                .registrationDate(LocalDateTime.now())
                .status(RegistrationStatus.REGISTERED)
                .build();

        when(registrationRepository.findById(200L)).thenReturn(Optional.of(reg));
        when(registrationRepository.save(any(Registration.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RegistrationResponse response = registrationService.cancelRegistration(200L, 1L, Role.STUDENT);

        assertNotNull(response);
        assertEquals(RegistrationStatus.CANCELLED, response.getStatus());
        verify(registrationRepository, times(1)).save(reg);
    }

    @Test
    @DisplayName("Should throw AccessDeniedException when student attempts to cancel another student's registration")
    void testUnauthorizedCancellation() {
        Registration reg = Registration.builder()
                .id(200L)
                .student(student) // student ID 1
                .event(event)
                .status(RegistrationStatus.REGISTERED)
                .build();

        when(registrationRepository.findById(200L)).thenReturn(Optional.of(reg));

        // Authenticated user has ID 2
        assertThrows(AccessDeniedException.class, () -> registrationService.cancelRegistration(200L, 2L, Role.STUDENT));
    }
}
