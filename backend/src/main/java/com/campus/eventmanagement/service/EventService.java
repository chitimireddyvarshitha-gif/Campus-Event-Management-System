package com.campus.eventmanagement.service;

import com.campus.eventmanagement.dto.EventRequest;
import com.campus.eventmanagement.dto.EventResponse;
import com.campus.eventmanagement.entity.Event;
import com.campus.eventmanagement.entity.EventCategory;
import com.campus.eventmanagement.entity.EventStatus;
import com.campus.eventmanagement.entity.Registration;
import com.campus.eventmanagement.entity.RegistrationStatus;
import com.campus.eventmanagement.exception.BadRequestException;
import com.campus.eventmanagement.exception.ResourceNotFoundException;
import com.campus.eventmanagement.repository.EventRepository;
import com.campus.eventmanagement.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents(String search, EventCategory category, EventStatus status, LocalDate afterDate, Long currentUserId) {
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        List<Event> events = eventRepository.searchEvents(cleanSearch, category, status, afterDate);

        return events.stream()
                .map(event -> mapToEventResponse(event, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id, Long currentUserId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        return mapToEventResponse(event, currentUserId);
    }

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        if (request.getCapacity() <= 0) {
            throw new BadRequestException("Event capacity must be greater than zero");
        }

        Event event = Event.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .category(request.getCategory())
                .eventDate(request.getEventDate())
                .eventTime(request.getEventTime().trim())
                .venue(request.getVenue().trim())
                .organizer(request.getOrganizer().trim())
                .capacity(request.getCapacity())
                .registrationDeadline(request.getRegistrationDeadline())
                .imageUrl(request.getImageUrl() != null && !request.getImageUrl().isBlank()
                        ? request.getImageUrl().trim()
                        : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80")
                .status(request.getStatus() != null ? request.getStatus() : EventStatus.UPCOMING)
                .build();

        Event saved = eventRepository.save(event);
        return mapToEventResponse(saved, null);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (request.getCapacity() <= 0) {
            throw new BadRequestException("Event capacity must be greater than zero");
        }

        event.setTitle(request.getTitle().trim());
        event.setDescription(request.getDescription().trim());
        event.setCategory(request.getCategory());
        event.setEventDate(request.getEventDate());
        event.setEventTime(request.getEventTime().trim());
        event.setVenue(request.getVenue().trim());
        event.setOrganizer(request.getOrganizer().trim());
        event.setCapacity(request.getCapacity());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        if (request.getImageUrl() != null) {
            event.setImageUrl(request.getImageUrl().trim());
        }
        if (request.getStatus() != null) {
            event.setStatus(request.getStatus());
        }

        Event updated = eventRepository.save(event);
        return mapToEventResponse(updated, null);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        eventRepository.delete(event);
    }

    public EventResponse mapToEventResponse(Event event, Long currentUserId) {
        long activeCount = registrationRepository.countByEventIdAndStatus(event.getId(), RegistrationStatus.REGISTERED);
        long availableSeats = Math.max(0, event.getCapacity() - activeCount);

        boolean isRegistered = false;
        Long userRegistrationId = null;

        if (currentUserId != null) {
            Optional<Registration> reg = registrationRepository.findByStudentIdAndEventId(currentUserId, event.getId());
            if (reg.isPresent() && reg.get().getStatus() == RegistrationStatus.REGISTERED) {
                isRegistered = true;
                userRegistrationId = reg.get().getId();
            }
        }

        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .category(event.getCategory())
                .eventDate(event.getEventDate())
                .eventTime(event.getEventTime())
                .venue(event.getVenue())
                .organizer(event.getOrganizer())
                .capacity(event.getCapacity())
                .registrationDeadline(event.getRegistrationDeadline())
                .imageUrl(event.getImageUrl())
                .status(event.getStatus())
                .registeredCount(activeCount)
                .availableSeats(availableSeats)
                .isRegistered(isRegistered)
                .userRegistrationId(userRegistrationId)
                .createdAt(event.getCreatedAt())
                .build();
    }
}
