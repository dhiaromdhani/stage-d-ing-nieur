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
@Document(collection = "conversions_conge")
public class ConversionConge {
    @Id
    private String id;

    private String employeId;
    private String employeNom;
    private String employeEmail;

    private Integer nombreJours;
    private Double montantCalcule; // en TND
    private Double salaireJournalierUtilise; // conservé pour traçabilité

    private StatutConversion statut;
    private String commentaireRh;
    private LocalDateTime dateDemande;
    private LocalDateTime dateTraitement;
}