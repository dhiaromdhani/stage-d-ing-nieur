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
@Document(collection = "justificatifs")
public class Justificatif {
    @Id
    private String id;

    private String employeId;
    private String employeNom;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String motif;

    private StatutJustificatif statut;
    private String commentaireRh;
    private LocalDateTime dateSoumission;
    private LocalDateTime dateTraitement;
}