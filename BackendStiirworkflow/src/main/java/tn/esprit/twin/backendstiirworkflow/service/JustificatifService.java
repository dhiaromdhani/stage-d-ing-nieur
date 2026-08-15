package tn.esprit.twin.backendstiirworkflow.service;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.Justificatif;
import tn.esprit.twin.backendstiirworkflow.entity.StatutJustificatif;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.JustificatifRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JustificatifService {

    private final JustificatifRepository justificatifRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Justificatif soumettre(String emailConnecte, LocalDate dateDebut, LocalDate dateFin, String motif) {
        User employe = userRepository.findByEmail(emailConnecte)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        if (dateFin.isBefore(dateDebut)) {
            throw new RuntimeException("La date de fin doit être après la date de début.");
        }

        Justificatif j = new Justificatif();
        j.setEmployeId(employe.getId());
        j.setEmployeNom(employe.getFirstName() + " " + employe.getLastName());
        j.setDateDebut(dateDebut);
        j.setDateFin(dateFin);
        j.setMotif(motif);
        j.setStatut(StatutJustificatif.EN_ATTENTE);
        j.setDateSoumission(LocalDateTime.now());

        Justificatif saved = justificatifRepository.save(j);

        List<User> rhList = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "ROLE_RH".equals(u.getRole().name()))
                .toList();
        notificationService.notifierNouveauJustificatif(rhList, employe, saved);

        return saved;
    }

    public Justificatif changerStatut(String id, StatutJustificatif statut, String commentaire) {
        Justificatif j = justificatifRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Justificatif introuvable"));

        j.setStatut(statut);
        j.setCommentaireRh(commentaire);
        j.setDateTraitement(LocalDateTime.now());

        return justificatifRepository.save(j);
    }

    public List<Justificatif> getMesJustificatifs(String emailConnecte) {
        User employe = userRepository.findByEmail(emailConnecte)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
        return justificatifRepository.findByEmployeIdOrderByDateSoumissionDesc(employe.getId());
    }

    public List<Justificatif> getEnAttente() {
        return justificatifRepository.findByStatutOrderByDateSoumissionDesc(StatutJustificatif.EN_ATTENTE);
    }

    public List<Justificatif> getTousParEmploye(String employeId) {
        return justificatifRepository.findByEmployeIdOrderByDateSoumissionDesc(employeId);
    }
}