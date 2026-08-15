package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.dto.RapportAbsence;
import tn.esprit.twin.backendstiirworkflow.service.AbsenceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/absences")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RH')")
public class AbsenceController {

    private final AbsenceService absenceService;

    @GetMapping("/employe/{id}")
    public RapportAbsence rapportEmploye(
            @PathVariable String id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin
    ) {
        return absenceService.calculerRapport(id, debut, fin);
    }

    @GetMapping("/tous")
    public List<RapportAbsence> rapportTous(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin
    ) {
        return absenceService.calculerRapportTous(debut, fin);
    }
}