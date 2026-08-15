package tn.esprit.twin.backendstiirworkflow.service;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.*;
import tn.esprit.twin.backendstiirworkflow.repository.ActiviteRepository;
import tn.esprit.twin.backendstiirworkflow.repository.CandidatureRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final ActiviteRepository activiteRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Candidature postulerParEmail(String activiteId, String emailConnecte) {
        User employe = userRepository.findByEmail(emailConnecte)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        candidatureRepository.findByActiviteIdAndEmployeId(activiteId, employe.getId())
                .ifPresent(c -> { throw new RuntimeException("Vous avez déjà postulé à cette activité."); });

        Activite activite = activiteRepository.findById(activiteId)
                .orElseThrow(() -> new RuntimeException("Activité introuvable"));

        Candidature candidature = new Candidature();
        candidature.setActiviteId(activiteId);
        candidature.setEmployeId(employe.getId());
        candidature.setEmployeNom(employe.getFirstName() + " " + employe.getLastName());
        candidature.setEmployeEmail(employe.getEmail());
        candidature.setStatut(StatutCandidature.EN_ATTENTE);
        candidature.setDateCandidature(LocalDateTime.now());

        Candidature saved = candidatureRepository.save(candidature);

        // notifier le RH créateur de l'activité (createdByUserId contient son email)
        Optional<User> rh = userRepository.findByEmail(activite.getCreatedByUserId());
        rh.ifPresent(rhUser -> notificationService.notifierNouvelleCandidature(rhUser, activite, employe, saved));

        return saved;
    }

    public List<Candidature> getMesCandidaturesParEmail(String emailConnecte) {
        User employe = userRepository.findByEmail(emailConnecte)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
        return candidatureRepository.findByEmployeId(employe.getId());
    }

    public List<Candidature> getCandidaturesParActivite(String activiteId) {
        return candidatureRepository.findByActiviteId(activiteId);
    }

    public Candidature changerStatut(String candidatureId, StatutCandidature statut) {
        Candidature c = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));
        c.setStatut(statut);
        Candidature updated = candidatureRepository.save(c);

        // notifier l'employé du résultat
        userRepository.findById(c.getEmployeId())
                .ifPresent(employe -> notificationService.notifierResultatCandidature(employe, c));

        return updated;
    }
}