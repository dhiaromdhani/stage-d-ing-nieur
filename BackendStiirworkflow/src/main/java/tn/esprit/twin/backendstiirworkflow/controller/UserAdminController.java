package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserAdminController {

    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('RH')")
    public List<User> getAll() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}/salaire")
    @PreAuthorize("hasRole('RH')")
    public User setSalaire(@PathVariable String id, @RequestBody Map<String, Double> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
        user.setSalaireMensuel(body.get("salaireMensuel"));
        return userRepository.save(user);
    }

    @PutMapping("/{id}/profil")
    @PreAuthorize("hasRole('ADMIN')")
    public User setProfil(@PathVariable String id, @RequestBody Map<String, Object> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        if (body.containsKey("anneesExperience")) {
            user.setAnneesExperience(((Number) body.get("anneesExperience")).intValue());
        }
        if (body.containsKey("niveauPoste")) {
            user.setNiveauPoste((String) body.get("niveauPoste"));
        }
        if (body.containsKey("specialite")) {
            user.setSpecialite((String) body.get("specialite"));
        }
        if (body.containsKey("estManager")) {
            user.setEstManager((Boolean) body.get("estManager"));
        }
        if (body.containsKey("tailleEquipe") && body.get("tailleEquipe") != null) {
            user.setTailleEquipe(((Number) body.get("tailleEquipe")).intValue());
        }

        return userRepository.save(user);
    }
}