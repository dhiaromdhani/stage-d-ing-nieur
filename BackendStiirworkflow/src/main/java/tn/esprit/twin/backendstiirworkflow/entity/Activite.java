package tn.esprit.twin.backendstiirworkflow.entity;

import tn.esprit.twin.backendstiirworkflow.dto.AnalyseIAResult;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "activites")
public class Activite {

    @Id
    private String id;

    private String titre;
    private String description;
    private ActiviteType type;

    private List<String> departmentsCibles;
    private List<String> competencesRequises;
    private Integer nombreEmployesSouhaite;

    private String lieu;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Integer placesDisponibles;

    private String conditions; // texte libre écrit par le RH, ex: "5 ans d'expérience minimum, niveau intermédiaire"

    private String createdByUserId;
    private LocalDate createdAt;

    private AnalyseIAResult analyseIA;

    private java.util.List<String> employesAffectesIds; // liste finale confirmée par le RH (ids Mongo)
    private Boolean affectationConfirmee; // false tant que le RH n'a pas validé
}