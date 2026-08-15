package tn.esprit.twin.backendstiirworkflow.controller;

import tn.esprit.twin.backendstiirworkflow.dto.DashboardStats;
import tn.esprit.twin.backendstiirworkflow.model.SoldeConge;
import tn.esprit.twin.backendstiirworkflow.service.SoldeCongeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/soldes")
public class SoldeCongeController {

    @Autowired
    private SoldeCongeService soldeCongeService;

    @GetMapping("/me")
    public SoldeConge getMySolde(Authentication authentication) {
        return soldeCongeService.getSoldeAnneeCourante(authentication.getName());
    }

    @GetMapping("/dashboard")
    public DashboardStats getMyDashboardStats(Authentication authentication) {
        return soldeCongeService.getDashboardStats(authentication.getName());
    }

    @GetMapping("/{userId}")
    public SoldeConge getSolde(@PathVariable String userId) {
        return soldeCongeService.getSoldeAnneeCourante(userId);
    }

    @GetMapping("/{userId}/{annee}")
    public SoldeConge getSoldeAnnee(@PathVariable String userId, @PathVariable int annee) {
        return soldeCongeService.getOuCreerSolde(userId, annee);
    }

    @PostMapping("/{userId}/{annee}/init")
    public SoldeConge initSolde(@PathVariable String userId, @PathVariable int annee,
                                @RequestParam(defaultValue = "30") int totalJours) {
        return soldeCongeService.initialiserSolde(userId, annee, totalJours);
    }
}