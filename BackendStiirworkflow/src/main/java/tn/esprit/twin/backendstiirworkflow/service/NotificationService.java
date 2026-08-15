package tn.esprit.twin.backendstiirworkflow.service;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.Activite;
import tn.esprit.twin.backendstiirworkflow.entity.Candidature;
import tn.esprit.twin.backendstiirworkflow.entity.Notification;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import tn.esprit.twin.backendstiirworkflow.entity.ConversionConge;
import tn.esprit.twin.backendstiirworkflow.entity.Justificatif;
import tn.esprit.twin.backendstiirworkflow.entity.AffectationEmploye;
import tn.esprit.twin.backendstiirworkflow.entity.StatutAffectation;


@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /*public void notifierEmployesAffectes(Activite activite, List<User> employes) {
        for (User employe : employes) {
            Notification notif = new Notification();
            notif.setUserId(employe.getId());
            notif.setActiviteId(activite.getId());
            notif.setTitre("Nouvelle activité : " + activite.getTitre());
            notif.setMessage(
                    "Vous avez été sélectionné(e) pour l'activité \"" + activite.getTitre() +
                            "\" (" + activite.getType() + ") du " + activite.getDateDebut() +
                            " au " + activite.getDateFin() + "."
            );
            notif.setType("AFFECTATION");
            notif.setLue(false);
            notif.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notif);
        }
    }*/

    public void notifierNouveauJustificatif(List<User> destinatairesRh, User employe, Justificatif justificatif) {
        for (User rh : destinatairesRh) {
            Notification notif = new Notification();
            notif.setUserId(rh.getId());
            notif.setCandidatureId(justificatif.getId());
            notif.setTitre("Nouveau justificatif d'absence");
            notif.setMessage(
                    employe.getFirstName() + " " + employe.getLastName() +
                            " a soumis un justificatif du " + justificatif.getDateDebut() +
                            " au " + justificatif.getDateFin() + " (" + justificatif.getMotif() + ")."
            );
            notif.setType("JUSTIFICATIF");
            notif.setLue(false);
            notif.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notif);
        }
    }

    public void notifierNouvelleCandidature(User rh, Activite activite, User employe, Candidature candidature) {
        Notification notif = new Notification();
        notif.setUserId(rh.getId());
        notif.setActiviteId(activite.getId());
        notif.setCandidatureId(candidature.getId());
        notif.setTitre("Nouvelle candidature : " + activite.getTitre());
        notif.setMessage(
                employe.getFirstName() + " " + employe.getLastName() +
                        " a postulé à l'activité \"" + activite.getTitre() + "\"."
        );
        notif.setType("CANDIDATURE");
        notif.setLue(false);
        notif.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notif);
    }

    public void notifierResultatCandidature(User employe, Candidature candidature) {
        Notification notif = new Notification();
        notif.setUserId(employe.getId());
        notif.setActiviteId(candidature.getActiviteId());
        notif.setCandidatureId(candidature.getId());
        boolean accepte = candidature.getStatut().name().equals("ACCEPTEE");
        notif.setTitre(accepte ? "Candidature acceptée" : "Candidature refusée");
        notif.setMessage(
                accepte
                        ? "Votre candidature a été acceptée par le RH."
                        : "Votre candidature a été refusée."
        );
        notif.setType("RESULTAT_CANDIDATURE");
        notif.setLue(false);
        notif.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notif);
    }

    public List<Notification> getMesNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long compterNonLues(String userId) {
        return notificationRepository.countByUserIdAndLueFalse(userId);
    }

    public void marquerCommeLue(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setLue(true);
            notificationRepository.save(n);
        });
    }

    public void notifierNouvelleConversion(List<User> destinatairesRh, User employe, ConversionConge conversion) {
        for (User rh : destinatairesRh) {
            Notification notif = new Notification();
            notif.setUserId(rh.getId());
            notif.setCandidatureId(conversion.getId()); // réutilise ce champ générique pour l'id de référence
            notif.setTitre("Demande de conversion congé → argent");
            notif.setMessage(
                    employe.getFirstName() + " " + employe.getLastName() +
                            " demande la conversion de " + conversion.getNombreJours() +
                            " jour(s) de congé en " + conversion.getMontantCalcule() + " DT."
            );
            notif.setType("CONVERSION_CONGE");
            notif.setLue(false);
            notif.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notif);
        }
    }

    public void notifierResultatConversion(User employe, ConversionConge conversion) {
        Notification notif = new Notification();
        notif.setUserId(employe.getId());
        notif.setCandidatureId(conversion.getId());
        boolean accepte = conversion.getStatut().name().equals("ACCEPTEE");
        notif.setTitre(accepte ? "Conversion de congé acceptée" : "Conversion de congé refusée");
        notif.setMessage(
                accepte
                        ? "Votre demande de conversion de " + conversion.getNombreJours() + " jour(s) en " + conversion.getMontantCalcule() + " DT a été acceptée."
                        : "Votre demande de conversion de " + conversion.getNombreJours() + " jour(s) a été refusée."
                        + (conversion.getCommentaireRh() != null ? " Motif : " + conversion.getCommentaireRh() : "")
        );
        notif.setType("RESULTAT_CONVERSION");
        notif.setLue(false);
        notif.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notif);
    }

    public void notifierAffectationAvecReponse(User employe, Activite activite, AffectationEmploye affectation) {
        Notification notif = new Notification();
        notif.setUserId(employe.getId());
        notif.setActiviteId(activite.getId());
        notif.setCandidatureId(affectation.getId()); // réutilise ce champ générique comme id de référence
        notif.setTitre("Affectation proposée : " + activite.getTitre());
        notif.setMessage(
                "Vous avez été sélectionné(e) pour l'activité \"" + activite.getTitre() +
                        "\" (" + activite.getType() + ") du " + activite.getDateDebut() +
                        " au " + activite.getDateFin() + ". Merci de confirmer votre participation."
        );
        notif.setType("AFFECTATION");
        notif.setLue(false);
        notif.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notif);
    }

    public void notifierReponseAffectation(User rh, User employe, Activite activite, AffectationEmploye affectation) {
        Notification notif = new Notification();
        notif.setUserId(rh.getId());
        notif.setActiviteId(activite.getId());
        notif.setCandidatureId(affectation.getId());
        boolean accepte = affectation.getStatut() == StatutAffectation.ACCEPTEE;
        notif.setTitre(accepte ? "Affectation acceptée" : "Affectation refusée");
        notif.setMessage(
                employe.getFirstName() + " " + employe.getLastName() +
                        (accepte ? " a accepté" : " a refusé") + " l'affectation à \"" + activite.getTitre() + "\"."
        );
        notif.setType("REPONSE_AFFECTATION");
        notif.setLue(false);
        notif.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notif);
    }
}