package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.Pointage;
import tn.esprit.twin.backendstiirworkflow.service.PointageService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pointages")
@RequiredArgsConstructor
public class PointageController {

    private final PointageService pointageService;

    @PostMapping("/entree")
    public Pointage entree(Authentication authentication) {
        return pointageService.pointerEntree(authentication.getName());
    }

    @PostMapping("/sortie")
    public Pointage sortie(Authentication authentication) {
        return pointageService.pointerSortie(authentication.getName());
    }

    @GetMapping("/my")
    public List<Pointage> mesPointages(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin,
            Authentication authentication
    ) {
        return pointageService.getMesPointages(authentication.getName(), debut, fin);
    }

    @PostMapping("/manuel")
    @PreAuthorize("hasRole('RH')")
    public Pointage manuel(@RequestBody Map<String, Object> body) {
        String employeId = (String) body.get("employeId");
        LocalDate date = LocalDate.parse((String) body.get("date"));
        LocalDateTime heureEntree = body.get("heureEntree") != null
                ? LocalDateTime.parse((String) body.get("heureEntree")) : null;
        LocalDateTime heureSortie = body.get("heureSortie") != null
                ? LocalDateTime.parse((String) body.get("heureSortie")) : null;
        return pointageService.pointageManuelRh(employeId, date, heureEntree, heureSortie);
    }
}