package tn.esprit.twin.backendstiirworkflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RapportAbsence {
    private String employeId;
    private String employeNom;
    private Double salaireMensuel;
    private Double salaireJournalier;

    private int joursOuvresDansLePeriode;
    private int joursPresents;
    private int joursCongeApprouve;
    private int joursJustifies;
    private int joursAbsenceNonJustifiee;
    private List<LocalDate> datesAbsenceNonJustifiee;

    private Double montantRetenue;
    private Double salaireNetEstime;
}