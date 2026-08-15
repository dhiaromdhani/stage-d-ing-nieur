package tn.esprit.twin.backendstiirworkflow.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DashboardStats {

    private long totalLeaves;

    private long remainingLeaves;

    private long pendingLeaves;

    private long approvedLeaves;

    private long refusedLeaves;

}