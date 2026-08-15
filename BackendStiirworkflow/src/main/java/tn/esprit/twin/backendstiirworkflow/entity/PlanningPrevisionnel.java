package tn.esprit.twin.backendstiirworkflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "planning_previsionnel")
public class PlanningPrevisionnel {

    @Id
    private String id;

    private String employeeId;

    private String employeeName;

    private String department;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private PlanningStatus status;

}