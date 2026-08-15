package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.ConversionConge;
import tn.esprit.twin.backendstiirworkflow.entity.StatutConversion;
import tn.esprit.twin.backendstiirworkflow.service.ConversionCongeService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversions")
@RequiredArgsConstructor
public class ConversionCongeController {

    private final ConversionCongeService conversionCongeService;

    @PostMapping
    public ConversionConge demander(@RequestBody Map<String, Integer> body, Authentication authentication) {
        Integer nombreJours = body.get("nombreJours");
        return conversionCongeService.demanderConversion(authentication.getName(), nombreJours);
    }

    @GetMapping("/my")
    public List<ConversionConge> mesConversions(Authentication authentication) {
        return conversionCongeService.getMesConversions(authentication.getName());
    }

    @GetMapping("/en-attente")
    @PreAuthorize("hasRole('RH')")
    public List<ConversionConge> enAttente() {
        return conversionCongeService.getConversionsEnAttente();
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasRole('RH')")
    public ConversionConge changerStatut(
            @PathVariable String id,
            @RequestParam StatutConversion statut,
            @RequestParam(required = false) String commentaire
    ) {
        return conversionCongeService.changerStatut(id, statut, commentaire);
    }
}