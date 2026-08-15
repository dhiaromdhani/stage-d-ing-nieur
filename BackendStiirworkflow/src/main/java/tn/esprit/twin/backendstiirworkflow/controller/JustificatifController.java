package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.Justificatif;
import tn.esprit.twin.backendstiirworkflow.entity.StatutJustificatif;
import tn.esprit.twin.backendstiirworkflow.service.JustificatifService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/justificatifs")
@RequiredArgsConstructor
public class JustificatifController {

    private final JustificatifService justificatifService;

    @PostMapping
    public Justificatif soumettre(@RequestBody Map<String, String> body, Authentication authentication) {
        LocalDate debut = LocalDate.parse(body.get("dateDebut"));
        LocalDate fin = LocalDate.parse(body.get("dateFin"));
        return justificatifService.soumettre(authentication.getName(), debut, fin, body.get("motif"));
    }

    @GetMapping("/my")
    public List<Justificatif> mesJustificatifs(Authentication authentication) {
        return justificatifService.getMesJustificatifs(authentication.getName());
    }

    @GetMapping("/en-attente")
    @PreAuthorize("hasRole('RH')")
    public List<Justificatif> enAttente() {
        return justificatifService.getEnAttente();
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasRole('RH')")
    public Justificatif changerStatut(
            @PathVariable String id,
            @RequestParam StatutJustificatif statut,
            @RequestParam(required = false) String commentaire
    ) {
        return justificatifService.changerStatut(id, statut, commentaire);
    }
}