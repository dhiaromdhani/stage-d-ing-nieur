package tn.esprit.twin.backendstiirworkflow.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "affectations_employes")
public class AffectationEmploye {
    @Id
    private String id;

    private String activiteId;
    private String activiteTitre;
    private String employeId;
    private String employeNom;

    private StatutAffectation statut;
    private LocalDateTime dateAffectation;
    private LocalDateTime dateReponse;
}