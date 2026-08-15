package tn.esprit.twin.backendstiirworkflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatistiquesGlobales {
    private long totalEmployes;
    private long totalActivites;
    private long totalCandidatures;
    private long candidaturesEnAttente;
    private long candidaturesAcceptees;
    private long candidaturesRefusees;
}