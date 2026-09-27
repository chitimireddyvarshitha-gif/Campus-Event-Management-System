package com.campus.eventmanagement.repository;

import com.campus.eventmanagement.entity.Event;
import com.campus.eventmanagement.entity.EventCategory;
import com.campus.eventmanagement.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(EventStatus status);
    List<Event> findByCategory(EventCategory category);

    @Query("SELECT e FROM Event e WHERE " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:afterDate IS NULL OR e.eventDate >= :afterDate) AND " +
           "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.venue) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.organizer) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY e.eventDate ASC")
    List<Event> searchEvents(
            @Param("search") String search,
            @Param("category") EventCategory category,
            @Param("status") EventStatus status,
            @Param("afterDate") LocalDate afterDate
    );

    long countByStatus(EventStatus status);
    long countByCategory(EventCategory category);
}
