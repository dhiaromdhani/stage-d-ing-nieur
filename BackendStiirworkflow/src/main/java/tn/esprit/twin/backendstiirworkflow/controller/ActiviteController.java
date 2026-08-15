package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import tn.esprit.twin.backendstiirworkflow.entity.Activite;
import tn.esprit.twin.backendstiirworkflow.entity.ActiviteType;
import tn.esprit.twin.backendstiirworkflow.service.ActiviteService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import tn.esprit.twin.backendstiirworkflow.entity.AffectationEmploye;
import tn.esprit.twin.backendstiirworkflow.entity.StatutAffectation;

import java.util.List;

@RestController
@RequestMapping("/api/activites")
@RequiredArgsConstructor
public class ActiviteController {

    private final ActiviteService activiteService;

    @PostMapping
    @PreAuthorize("hasRole('RH')")
    public Activite create(@RequestBody Activite activite, Authentication authentication) {
        String rhUserId = authentication.getName();
        return activiteService.createActivite(activite, rhUserId);
    }

    @GetMapping
    public List<Activite> getAll() {
        return activiteService.getAllActivites();
    }

    @GetMapping("/type/{type}")
    public List<Activite> getByType(@PathVariable ActiviteType type) {
        return activiteService.getActivitesByType(type);
    }

    @GetMapping("/{id}")
    public Activite getById(@PathVariable String id) {
        return activiteService.getActiviteById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<Activite> updateActivite(
            @PathVariable String id,
            @RequestBody Activite activiteRequest
    ) {
        return ResponseEntity.ok(activiteService.updateActivite(id, activiteRequest));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RH')")
    public ResponseEntity<Void> deleteActivite(@PathVariable String id) {
        activiteService.deleteActivite(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/confirmer-affectation")
    @PreAuthorize("hasRole('RH')")
    public Activite confirmerAffectation(@PathVariable String id, @RequestBody List<String> employeIds) {
        return activiteService.confirmerAffectation(id, employeIds);
    }

    @PutMapping("/affectations/{id}/reponse")
    public AffectationEmploye repondreAffectation(
            @PathVariable String id,
            @RequestParam StatutAffectation statut,
            Authentication authentication
    ) {
        return activiteService.repondreAffectation(id, authentication.getName(), statut);
    }

    @GetMapping("/affectations/my")
    public List<AffectationEmploye> mesAffectations(Authentication authentication) {
        return activiteService.getMesAffectations(authentication.getName());
    }
}