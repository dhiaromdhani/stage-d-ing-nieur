package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.dto.StatistiquesGlobales;
import tn.esprit.twin.backendstiirworkflow.service.StatistiquesService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistiques")
@RequiredArgsConstructor
public class StatistiquesController {

    private final StatistiquesService statistiquesService;

    @GetMapping
    @PreAuthorize("hasRole('RH')")
    public StatistiquesGlobales getStatistiques() {
        return statistiquesService.getStatistiques();
    }
}