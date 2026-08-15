package tn.esprit.twin.backendstiirworkflow.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pointages")
public class Pointage {
    @Id
    private String id;

    private String employeId;
    private LocalDate date;
    private LocalDateTime heureEntree;
    private LocalDateTime heureSortie;
    private String source; // "EMPLOYE" ou "RH"
    private LocalDateTime createdAt;
}