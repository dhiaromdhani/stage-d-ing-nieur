package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import tn.esprit.twin.backendstiirworkflow.entity.PlanningPrevisionnel;
import tn.esprit.twin.backendstiirworkflow.service.PlanningPrevisionnelService;

import java.util.List;

@RestController
@RequestMapping("/api/planning-previsionnel")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PlanningPrevisionnelController {

    private final PlanningPrevisionnelService planningService;


    // =========================================================
    // Voir planning de son équipe
    // Chef + employés
    // =========================================================

    @GetMapping("/equipe")
    public ResponseEntity<List<PlanningPrevisionnel>>
    getTeamPlanning(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                planningService.getTeamPlanning(
                        authentication.getName()
                )
        );
    }


    // =========================================================
    // Mes prévisions
    // =========================================================

    @GetMapping("/mes-previsions")
    public ResponseEntity<List<PlanningPrevisionnel>>
    getMyPlanning(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                planningService.getMyPlanning(
                        authentication.getName()
                )
        );
    }


    // =========================================================
    // Créer
    // =========================================================

    @PostMapping
    public ResponseEntity<PlanningPrevisionnel> create(
            @RequestBody PlanningPrevisionnel planning,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                planningService.create(
                        planning,
                        authentication.getName()
                )
        );
    }


    // =========================================================
    // Modifier
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<PlanningPrevisionnel> update(
            @PathVariable String id,
            @RequestBody PlanningPrevisionnel planning,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                planningService.update(
                        id,
                        planning,
                        authentication.getName()
                )
        );
    }


    // =========================================================
    // Supprimer
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable String id,
            Authentication authentication
    ) {

        planningService.delete(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok(
                "Prévision supprimée"
        );
    }
}