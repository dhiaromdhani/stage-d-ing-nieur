package tn.esprit.twin.backendstiirworkflow.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class LeaveResponseDto {

    private String id;

    private String employeeId;

    private String employeeName;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private String status;

    private String comment;

    private LocalDateTime createdAt;
    private String role;

}