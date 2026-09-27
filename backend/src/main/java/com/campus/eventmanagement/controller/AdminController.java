package com.campus.eventmanagement.controller;

import com.campus.eventmanagement.dto.ApiResponse;
import com.campus.eventmanagement.dto.DashboardStatsResponse;
import com.campus.eventmanagement.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * Get all events with detailed registration statistics for admin/faculty
     * GET /api/admin/events
     */
    @GetMapping("/api/admin/events")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAdminEvents() {
        List<Map<String, Object>> events = adminService.getAdminEvents();
        return ResponseEntity.ok(ApiResponse.ok("Admin events fetched successfully", events));
    }

    /**
     * Get registered students list for a specific event
     * GET /api/events/{eventId}/registrations
     */
    @GetMapping("/api/events/{eventId}/registrations")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEventRegistrations(@PathVariable Long eventId) {
        Map<String, Object> data = adminService.getEventRegistrations(eventId);
        return ResponseEntity.ok(ApiResponse.ok("Event registrations fetched successfully", data));
    }

    /**
     * Get aggregated metrics and registration stats for dashboard
     * GET /api/admin/dashboard
     */
    @GetMapping("/api/admin/dashboard")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard statistics fetched successfully", stats));
    }
}
