package tn.esprit.twin.backendstiirworkflow.service;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.dto.StatistiquesGlobales;
import tn.esprit.twin.backendstiirworkflow.entity.StatutCandidature;
import tn.esprit.twin.backendstiirworkflow.repository.ActiviteRepository;
import tn.esprit.twin.backendstiirworkflow.repository.CandidatureRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatistiquesService {

    private final UserRepository userRepository;
    private final ActiviteRepository activiteRepository;
    private final CandidatureRepository candidatureRepository;

    public StatistiquesGlobales getStatistiques() {
        long totalEmployes = userRepository.findAll().stream()
                .filter(u -> "ROLE_EMPLOYEE".equals(u.getRole() != null ? u.getRole().name() : null))
                .count();

        return new StatistiquesGlobales(
                totalEmployes,
                activiteRepository.count(),
                candidatureRepository.count(),
                candidatureRepository.countByStatut(StatutCandidature.EN_ATTENTE),
                candidatureRepository.countByStatut(StatutCandidature.ACCEPTEE),
                candidatureRepository.countByStatut(StatutCandidature.REFUSEE)
        );
    }
}