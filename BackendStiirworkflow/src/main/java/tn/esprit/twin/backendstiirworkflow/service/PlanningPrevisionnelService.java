package tn.esprit.twin.backendstiirworkflow.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import tn.esprit.twin.backendstiirworkflow.entity.PlanningPrevisionnel;
import tn.esprit.twin.backendstiirworkflow.entity.PlanningStatus;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.PlanningPrevisionnelRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanningPrevisionnelService {

    private final PlanningPrevisionnelRepository planningRepository;
    private final UserRepository userRepository;


    // =========================================================
    // Planning de l'équipe
    // =========================================================

    public List<PlanningPrevisionnel> getTeamPlanning(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Utilisateur introuvable"
                                )
                        );


        return planningRepository
                .findByDepartmentAndStatus(
                        user.getDepartment(),
                        PlanningStatus.PLANNED
                );
    }


    // =========================================================
    // Planning de l'employé connecté
    // =========================================================

    public List<PlanningPrevisionnel> getMyPlanning(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Utilisateur introuvable"
                                )
                        );


        return planningRepository
                .findByEmployeeId(user.getId());
    }


    // =========================================================
    // Créer une prévision
    // =========================================================

    public PlanningPrevisionnel create(
            PlanningPrevisionnel planning,
            String email
    ) {

        User employee =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Utilisateur introuvable"
                                )
                        );


        if (planning.getStartDate() == null ||
                planning.getEndDate() == null) {

            throw new RuntimeException(
                    "Les dates sont obligatoires"
            );
        }


        if (planning.getEndDate()
                .isBefore(planning.getStartDate())) {

            throw new RuntimeException(
                    "La date de fin doit être après la date de début"
            );
        }


        planning.setEmployeeId(
                employee.getId()
        );

        planning.setEmployeeName(
                buildName(employee)
        );

        planning.setDepartment(
                employee.getDepartment()
        );

        planning.setStatus(
                PlanningStatus.PLANNED
        );


        return planningRepository.save(
                planning
        );
    }


    // =========================================================
    // Modifier
    // =========================================================

    public PlanningPrevisionnel update(
            String id,
            PlanningPrevisionnel updated,
            String email
    ) {

        User employee =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Utilisateur introuvable"
                                )
                        );


        PlanningPrevisionnel existing =
                planningRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Prévision introuvable"
                                )
                        );


        // L'employé ne peut modifier que sa prévision
        if (!existing.getEmployeeId()
                .equals(employee.getId())) {

            throw new RuntimeException(
                    "Vous ne pouvez modifier que vos propres prévisions"
            );
        }


        if (updated.getEndDate()
                .isBefore(updated.getStartDate())) {

            throw new RuntimeException(
                    "Dates invalides"
            );
        }


        existing.setStartDate(
                updated.getStartDate()
        );

        existing.setEndDate(
                updated.getEndDate()
        );

        existing.setReason(
                updated.getReason()
        );


        return planningRepository.save(
                existing
        );
    }


    // =========================================================
    // Supprimer
    // =========================================================

    public void delete(
            String id,
            String email
    ) {

        User employee =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Utilisateur introuvable"
                                )
                        );


        PlanningPrevisionnel planning =
                planningRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Prévision introuvable"
                                )
                        );


        if (!planning.getEmployeeId()
                .equals(employee.getId())) {

            throw new RuntimeException(
                    "Accès refusé"
            );
        }


        planningRepository.deleteById(id);
    }


    private String buildName(User user) {

        String first =
                user.getFirstName() == null
                        ? ""
                        : user.getFirstName();

        String last =
                user.getLastName() == null
                        ? ""
                        : user.getLastName();

        return (first + " " + last).trim();
    }
}