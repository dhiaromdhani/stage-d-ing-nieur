package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import tn.esprit.twin.backendstiirworkflow.entity.Remplacement;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;
import tn.esprit.twin.backendstiirworkflow.service.RemplacementService;

import java.util.List;

@RestController
@RequestMapping("/api/remplacements")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RemplacementController {

    private final RemplacementService remplacementService;
    private final UserRepository userRepository;


    // =========================================================
    // Voir les remplacements de son département
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Remplacement>> getRemplacements(
            Authentication authentication
    ) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );


        return ResponseEntity.ok(
                remplacementService
                        .getByDepartment(user.getDepartment())
        );
    }


    // =========================================================
    // Créer
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<Remplacement> create(
            @RequestBody Remplacement remplacement,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                remplacementService.create(
                        remplacement,
                        authentication.getName()
                )
        );
    }


    // =========================================================
    // Modifier
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<Remplacement> update(
            @PathVariable String id,
            @RequestBody Remplacement remplacement,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                remplacementService.update(
                        id,
                        remplacement,
                        authentication.getName()
                )
        );
    }


    // =========================================================
    // Supprimer
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CHEF')")
    public ResponseEntity<?> delete(
            @PathVariable String id,
            Authentication authentication
    ) {

        remplacementService.delete(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok(
                "Remplacement supprimé"
        );
    }
}