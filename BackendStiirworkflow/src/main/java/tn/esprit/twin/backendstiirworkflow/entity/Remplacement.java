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
@Document(collection = "remplacements")
public class Remplacement {

    @Id
    private String id;

    // Employé absent
    private String employeeAbsentId;
    private String employeeAbsentName;

    // Employé qui assure le remplacement
    private String replacementEmployeeId;
    private String replacementEmployeeName;

    // Département
    private String department;

    // Période
    private LocalDate startDate;
    private LocalDate endDate;

    // Tâches assurées
    private String tasks;

    // Créé par le chef
    private String createdBy;

    private String createdByName;
}