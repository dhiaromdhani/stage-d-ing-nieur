package tn.esprit.twin.backendstiirworkflow.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RemplacementRequest {

    private String employeeId;

    private String replacementEmployeeId;

    private LocalDate startDate;

    private LocalDate endDate;

    private String tasks;
}