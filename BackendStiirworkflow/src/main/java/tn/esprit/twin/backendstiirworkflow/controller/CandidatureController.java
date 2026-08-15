package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.Candidature;
import tn.esprit.twin.backendstiirworkflow.entity.StatutCandidature;
import tn.esprit.twin.backendstiirworkflow.service.CandidatureService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
@RequiredArgsConstructor
public class CandidatureController {

    private final CandidatureService candidatureService;

    @PostMapping("/postuler/{activiteId}")
    public Candidature postuler(@PathVariable String activiteId, Authentication authentication) {
        return candidatureService.postulerParEmail(activiteId, authentication.getName());
    }

    @GetMapping("/my")
    public List<Candidature> mesCandidatures(Authentication authentication) {
        return candidatureService.getMesCandidaturesParEmail(authentication.getName());
    }

    @GetMapping("/activite/{activiteId}")
    @PreAuthorize("hasRole('RH')")
    public List<Candidature> parActivite(@PathVariable String activiteId) {
        return candidatureService.getCandidaturesParActivite(activiteId);
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasRole('RH')")
    public Candidature changerStatut(@PathVariable String id, @RequestParam StatutCandidature statut) {
        return candidatureService.changerStatut(id, statut);
    }
}