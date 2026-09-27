package com.campus.eventmanagement.service;

import com.campus.eventmanagement.dto.DashboardStatsResponse;
import com.campus.eventmanagement.dto.RegistrationResponse;
import com.campus.eventmanagement.entity.Event;
import com.campus.eventmanagement.entity.EventCategory;
import com.campus.eventmanagement.entity.EventStatus;
import com.campus.eventmanagement.entity.Registration;
import com.campus.eventmanagement.entity.RegistrationStatus;
import com.campus.eventmanagement.exception.ResourceNotFoundException;
import com.campus.eventmanagement.repository.EventRepository;
import com.campus.eventmanagement.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final RegistrationService registrationService;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAdminEvents() {
        List<Event> events = eventRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Event e : events) {
            long activeCount = registrationRepository.countByEventIdAndStatus(e.getId(), RegistrationStatus.REGISTERED);
            long cancelledCount = registrationRepository.countByEventIdAndStatus(e.getId(), RegistrationStatus.CANCELLED);

            Map<String, Object> map = new HashMap<>();
            map.put("id", e.getId());
            map.put("title", e.getTitle());
            map.put("description", e.getDescription());
            map.put("category", e.getCategory());
            map.put("eventDate", e.getEventDate());
            map.put("eventTime", e.getEventTime());
            map.put("venue", e.getVenue());
            map.put("organizer", e.getOrganizer());
            map.put("capacity", e.getCapacity());
            map.put("registrationDeadline", e.getRegistrationDeadline());
            map.put("imageUrl", e.getImageUrl());
            map.put("status", e.getStatus());
            map.put("activeRegistrations", activeCount);
            map.put("cancelledRegistrations", cancelledCount);
            map.put("totalRegistrations", activeCount + cancelledCount);
            map.put("availableSeats", Math.max(0, e.getCapacity() - activeCount));
            map.put("occupancyRate", Math.min(100, Math.round(((double) activeCount / e.getCapacity()) * 100)));

            result.add(map);
        }

        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getEventRegistrations(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));

        List<Registration> registrations = registrationRepository.findByEventIdWithStudent(eventId);
        long activeCount = registrations.stream().filter(r -> r.getStatus() == RegistrationStatus.REGISTERED).count();

        List<RegistrationResponse> regResponses = registrations.stream()
                .map(registrationService::mapToRegistrationResponse)
                .collect(Collectors.toList());

        Map<String, Object> eventInfo = new HashMap<>();
        eventInfo.put("id", event.getId());
        eventInfo.put("title", event.getTitle());
        eventInfo.put("capacity", event.getCapacity());
        eventInfo.put("totalRegistered", activeCount);
        eventInfo.put("availableSeats", Math.max(0, event.getCapacity() - activeCount));

        Map<String, Object> response = new HashMap<>();
        response.put("event", eventInfo);
        response.put("registrations", regResponses);

        return response;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalEvents = eventRepository.count();
        long upcomingEvents = eventRepository.countByStatus(EventStatus.UPCOMING);
        long completedEvents = eventRepository.countByStatus(EventStatus.COMPLETED);
        long cancelledEvents = eventRepository.countByStatus(EventStatus.CANCELLED);

        long totalRegistrations = registrationRepository.count();
        long activeRegistrations = registrationRepository.countByStatus(RegistrationStatus.REGISTERED);
        long cancelledRegistrations = registrationRepository.countByStatus(RegistrationStatus.CANCELLED);

        Map<String, Long> categoryBreakdown = new HashMap<>();
        for (EventCategory cat : EventCategory.values()) {
            categoryBreakdown.put(cat.name(), eventRepository.countByCategory(cat));
        }

        List<Registration> recent = registrationRepository.findRecentRegistrations();
        List<RegistrationResponse> recentResponses = recent.stream()
                .limit(10)
                .map(registrationService::mapToRegistrationResponse)
                .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .totalEvents(totalEvents)
                .upcomingEvents(upcomingEvents)
                .completedEvents(completedEvents)
                .cancelledEvents(cancelledEvents)
                .totalRegistrations(totalRegistrations)
                .activeRegistrations(activeRegistrations)
                .cancelledRegistrations(cancelledRegistrations)
                .categoryBreakdown(categoryBreakdown)
                .recentRegistrations(recentResponses)
                .build();
    }
}
