package tn.esprit.twin.backendstiirworkflow.entity;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "leave_requests")

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder

public class LeaveRequest {

    @Id
    private String id;

    private String employeeId;

    private String employeeName;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private int nbJours;

    private LeaveStatus status;

    private String comment;

    private LocalDateTime createdAt;

}