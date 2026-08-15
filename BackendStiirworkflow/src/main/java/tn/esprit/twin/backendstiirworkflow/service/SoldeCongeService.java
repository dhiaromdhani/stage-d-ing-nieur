package tn.esprit.twin.backendstiirworkflow.service;

import tn.esprit.twin.backendstiirworkflow.dto.DashboardStats;
import tn.esprit.twin.backendstiirworkflow.model.SoldeConge;
import tn.esprit.twin.backendstiirworkflow.repository.SoldeCongeRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
public class SoldeCongeService {

    private static final int JOURS_PAR_DEFAUT = 30;

    @Autowired
    private SoldeCongeRepository soldeCongeRepository;

    @Autowired
    private UserRepository userRepository;

    public SoldeConge getOuCreerSolde(String userId, int annee) {
        return soldeCongeRepository.findByUserIdAndAnnee(userId, annee)
                .orElseGet(() -> soldeCongeRepository.save(
                        new SoldeConge(userId, annee, JOURS_PAR_DEFAUT)
                ));
    }

    public SoldeConge getSoldeAnneeCourante(String userId) {
        if (userId != null && userId.contains("@")) {
            String resolvedUserId = userRepository.findByEmail(userId)
                    .map(user -> user.getId())
                    .orElse(userId);
            return getOuCreerSolde(resolvedUserId, Year.now().getValue());
        }
        return getOuCreerSolde(userId, Year.now().getValue());
    }

    public DashboardStats getDashboardStats(String email) {
        SoldeConge solde = getSoldeAnneeCourante(email);
        return DashboardStats.builder()
                .totalLeaves(solde.getTotalJours())
                .remainingLeaves(solde.getJoursRestants())
                .pendingLeaves(0L)
                .approvedLeaves(solde.getJoursUtilises())
                .refusedLeaves(0L)
                .build();
    }

    public boolean aAssezDeSolde(String userId, int annee, int joursDemandes) {
        SoldeConge solde = getOuCreerSolde(userId, annee);
        return joursDemandes <= solde.getJoursRestants();
    }

    public SoldeConge reserverJours(String userId, int annee, int joursDemandes) {
        SoldeConge solde = getOuCreerSolde(userId, annee);
        solde.setJoursUtilises(solde.getJoursUtilises() + joursDemandes);
        solde.recalculer();
        return soldeCongeRepository.save(solde);
    }

    public SoldeConge restituerJours(String userId, int annee, int joursDemandes) {
        SoldeConge solde = getOuCreerSolde(userId, annee);
        solde.setJoursUtilises(Math.max(0, solde.getJoursUtilises() - joursDemandes));
        solde.recalculer();
        return soldeCongeRepository.save(solde);
    }

    public SoldeConge initialiserSolde(String userId, int annee, int totalJours) {
        SoldeConge solde = soldeCongeRepository.findByUserIdAndAnnee(userId, annee)
                .orElse(new SoldeConge(userId, annee, totalJours));
        solde.setTotalJours(totalJours);
        solde.recalculer();
        return soldeCongeRepository.save(solde);
    }
}