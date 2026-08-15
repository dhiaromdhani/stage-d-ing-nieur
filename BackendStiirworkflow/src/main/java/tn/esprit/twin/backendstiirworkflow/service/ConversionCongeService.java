package tn.esprit.twin.backendstiirworkflow.service;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.*;
import tn.esprit.twin.backendstiirworkflow.model.SoldeConge;
import tn.esprit.twin.backendstiirworkflow.repository.ConversionCongeRepository;
import tn.esprit.twin.backendstiirworkflow.repository.SoldeCongeRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversionCongeService {

    private static final double JOURS_OUVRES_PAR_MOIS = 22.0;

    private final ConversionCongeRepository conversionRepository;
    private final UserRepository userRepository;
    private final SoldeCongeRepository soldeCongeRepository;
    private final NotificationService notificationService;

    public ConversionConge demanderConversion(String emailEmploye, Integer nombreJours) {
        if (nombreJours == null || nombreJours <= 0) {
            throw new RuntimeException("Le nombre de jours doit être supérieur à zéro.");
        }

        User employe = userRepository.findByEmail(emailEmploye)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        if (employe.getSalaireMensuel() == null || employe.getSalaireMensuel() <= 0) {
            throw new RuntimeException("Votre salaire n'est pas encore renseigné par le RH. Contactez les ressources humaines.");
        }

        int anneeActuelle = Year.now().getValue();
        SoldeConge solde = soldeCongeRepository.findByUserIdAndAnnee(employe.getId(), anneeActuelle)
                .orElseThrow(() -> new RuntimeException("Solde de congés introuvable pour cette année."));

        if (nombreJours > solde.getJoursRestants()) {
            throw new RuntimeException("Vous ne pouvez pas convertir plus de jours que votre solde restant (" + solde.getJoursRestants() + " jours).");
        }

        double salaireJournalier = employe.getSalaireMensuel() / JOURS_OUVRES_PAR_MOIS;
        double montant = salaireJournalier * nombreJours;

        ConversionConge conversion = new ConversionConge();
        conversion.setEmployeId(employe.getId());
        conversion.setEmployeNom(employe.getFirstName() + " " + employe.getLastName());
        conversion.setEmployeEmail(employe.getEmail());
        conversion.setNombreJours(nombreJours);
        conversion.setSalaireJournalierUtilise(salaireJournalier);
        conversion.setMontantCalcule(Math.round(montant * 1000.0) / 1000.0);
        conversion.setStatut(StatutConversion.EN_ATTENTE);
        conversion.setDateDemande(LocalDateTime.now());

        ConversionConge saved = conversionRepository.save(conversion);

        List<User> rhList = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "ROLE_RH".equals(u.getRole().name()))
                .toList();
        notificationService.notifierNouvelleConversion(rhList, employe, saved);

        return saved;
    }

    public ConversionConge changerStatut(String conversionId, StatutConversion statut, String commentaire) {
        ConversionConge conversion = conversionRepository.findById(conversionId)
                .orElseThrow(() -> new RuntimeException("Demande de conversion introuvable"));

        if (conversion.getStatut() != StatutConversion.EN_ATTENTE) {
            throw new RuntimeException("Cette demande a déjà été traitée.");
        }

        conversion.setStatut(statut);
        conversion.setCommentaireRh(commentaire);
        conversion.setDateTraitement(LocalDateTime.now());

        if (statut == StatutConversion.ACCEPTEE) {
            int anneeActuelle = Year.now().getValue();
            SoldeConge solde = soldeCongeRepository.findByUserIdAndAnnee(conversion.getEmployeId(), anneeActuelle)
                    .orElseThrow(() -> new RuntimeException("Solde de congés introuvable."));

            if (conversion.getNombreJours() > solde.getJoursRestants()) {
                throw new RuntimeException("Le solde restant de l'employé ne permet plus cette conversion.");
            }

            solde.setJoursUtilises(solde.getJoursUtilises() + conversion.getNombreJours());
            solde.recalculer();
            soldeCongeRepository.save(solde);
        }

        ConversionConge updated = conversionRepository.save(conversion);

        userRepository.findById(conversion.getEmployeId())
                .ifPresent(employe -> notificationService.notifierResultatConversion(employe, updated));

        return updated;
    }

    public List<ConversionConge> getMesConversions(String emailEmploye) {
        User employe = userRepository.findByEmail(emailEmploye)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
        return conversionRepository.findByEmployeIdOrderByDateDemandeDesc(employe.getId());
    }

    public List<ConversionConge> getConversionsEnAttente() {
        return conversionRepository.findByStatutOrderByDateDemandeDesc(StatutConversion.EN_ATTENTE);
    }
}