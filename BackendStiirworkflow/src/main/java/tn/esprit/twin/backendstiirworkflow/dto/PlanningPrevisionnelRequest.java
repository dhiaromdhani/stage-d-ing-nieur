package tn.esprit.twin.backendstiirworkflow.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanningPrevisionnelRequest {

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;
}