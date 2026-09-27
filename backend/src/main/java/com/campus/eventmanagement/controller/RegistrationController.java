package com.campus.eventmanagement.controller;

import com.campus.eventmanagement.dto.ApiResponse;
import com.campus.eventmanagement.dto.RegistrationResponse;
import com.campus.eventmanagement.security.UserDetailsImpl;
import com.campus.eventmanagement.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    /**
     * Register authenticated student for an event
     * POST /api/events/{eventId}/register
     */
    @PostMapping("/api/events/{eventId}/register")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<RegistrationResponse>> registerForEvent(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        RegistrationResponse response = registrationService.registerStudentForEvent(userDetails.getId(), eventId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Successfully registered for the event!", response));
    }

    /**
     * Get registered events for a student
     * GET /api/students/{studentId}/registrations
     */
    @GetMapping("/api/students/{studentId}/registrations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<RegistrationResponse>>> getStudentRegistrations(
            @PathVariable Long studentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        List<RegistrationResponse> list = registrationService.getStudentRegistrations(
                studentId,
                userDetails.getId(),
                userDetails.getRole()
        );
        return ResponseEntity.ok(ApiResponse.ok("Student registrations retrieved successfully", list));
    }

    /**
     * Cancel an existing event registration
     * DELETE /api/registrations/{registrationId}
     */
    @DeleteMapping("/api/registrations/{registrationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<RegistrationResponse>> cancelRegistration(
            @PathVariable Long registrationId,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        RegistrationResponse cancelled = registrationService.cancelRegistration(
                registrationId,
                userDetails.getId(),
                userDetails.getRole()
        );
        return ResponseEntity.ok(ApiResponse.ok("Registration successfully cancelled", cancelled));
    }
}
