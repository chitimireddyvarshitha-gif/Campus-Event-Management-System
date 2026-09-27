package com.campus.eventmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalEvents;
    private long upcomingEvents;
    private long completedEvents;
    private long cancelledEvents;
    private long totalRegistrations;
    private long activeRegistrations;
    private long cancelledRegistrations;
    private Map<String, Long> categoryBreakdown;
    private List<RegistrationResponse> recentRegistrations;
}
