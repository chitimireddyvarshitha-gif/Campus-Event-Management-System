package com.campus.eventmanagement.repository;

import com.campus.eventmanagement.entity.Registration;
import com.campus.eventmanagement.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    
    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);

    boolean existsByStudentIdAndEventIdAndStatus(Long studentId, Long eventId, RegistrationStatus status);

    Optional<Registration> findByStudentIdAndEventId(Long studentId, Long eventId);

    @Query("SELECT r FROM Registration r JOIN FETCH r.event WHERE r.student.id = :studentId ORDER BY r.registrationDate DESC")
    List<Registration> findByStudentIdWithEvent(@Param("studentId") Long studentId);

    @Query("SELECT r FROM Registration r JOIN FETCH r.student WHERE r.event.id = :eventId ORDER BY r.registrationDate DESC")
    List<Registration> findByEventIdWithStudent(@Param("eventId") Long eventId);

    long countByStatus(RegistrationStatus status);

    @Query("SELECT r FROM Registration r JOIN FETCH r.student JOIN FETCH r.event ORDER BY r.registrationDate DESC")
    List<Registration> findRecentRegistrations();
}
