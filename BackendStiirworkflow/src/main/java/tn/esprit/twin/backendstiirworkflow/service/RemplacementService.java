package tn.esprit.twin.backendstiirworkflow.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import tn.esprit.twin.backendstiirworkflow.entity.Remplacement;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.RemplacementRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RemplacementService {

    private final RemplacementRepository remplacementRepository;
    private final UserRepository userRepository;


    // =========================================================
    // Récupérer les remplacements d'un département
    // =========================================================

    public List<Remplacement> getByDepartment(String department) {

        return remplacementRepository
                .findByDepartment(department);
    }


    // =========================================================
    // Créer un remplacement
    // =========================================================

    public Remplacement create(
            Remplacement remplacement,
            String chefEmail
    ) {

        User chef = userRepository
                .findByEmail(chefEmail)
                .orElseThrow(() ->
                        new RuntimeException("Chef introuvable")
                );


        if (chef.getRole() == null ||
                !chef.getRole().name().equals("ROLE_CHEF")) {

            throw new RuntimeException(
                    "Seul un Chef de service peut créer un remplacement"
            );
        }


        User absent = userRepository
                .findById(remplacement.getEmployeeAbsentId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employé absent introuvable"
                        )
                );


        User replacement = userRepository
                .findById(remplacement.getReplacementEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employé remplaçant introuvable"
                        )
                );


        // Vérifier le département
        if (chef.getDepartment() == null ||
                !chef.getDepartment().equals(absent.getDepartment()) ||
                !chef.getDepartment().equals(replacement.getDepartment())) {

            throw new RuntimeException(
                    "Les employés doivent appartenir au même département"
            );
        }


        // Un employé ne peut pas se remplacer lui-même
        if (absent.getId().equals(replacement.getId())) {

            throw new RuntimeException(
                    "Un employé ne peut pas se remplacer lui-même"
            );
        }


        // Vérification dates
        if (remplacement.getStartDate() == null ||
                remplacement.getEndDate() == null) {

            throw new RuntimeException(
                    "Les dates sont obligatoires"
            );
        }


        if (remplacement.getEndDate()
                .isBefore(remplacement.getStartDate())) {

            throw new RuntimeException(
                    "La date de fin doit être après la date de début"
            );
        }


        remplacement.setEmployeeAbsentName(
                buildName(absent)
        );

        remplacement.setReplacementEmployeeName(
                buildName(replacement)
        );

        remplacement.setDepartment(
                chef.getDepartment()
        );

        remplacement.setCreatedBy(
                chef.getEmail()
        );

        remplacement.setCreatedByName(
                buildName(chef)
        );


        return remplacementRepository.save(
                remplacement
        );
    }


    // =========================================================
    // Modifier
    // =========================================================

    public Remplacement update(
            String id,
            Remplacement updated,
            String chefEmail
    ) {

        User chef = userRepository
                .findByEmail(chefEmail)
                .orElseThrow(() ->
                        new RuntimeException("Chef introuvable")
                );


        Remplacement existing =
                remplacementRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Remplacement introuvable"
                                )
                        );


        if (!chef.getDepartment()
                .equals(existing.getDepartment())) {

            throw new RuntimeException(
                    "Accès refusé"
            );
        }


        User absent = userRepository
                .findById(updated.getEmployeeAbsentId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employé absent introuvable"
                        )
                );


        User replacement = userRepository
                .findById(updated.getReplacementEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employé remplaçant introuvable"
                        )
                );


        if (!chef.getDepartment()
                .equals(absent.getDepartment()) ||
                !chef.getDepartment()
                        .equals(replacement.getDepartment())) {

            throw new RuntimeException(
                    "Les employés doivent appartenir au même département"
            );
        }


        if (absent.getId().equals(replacement.getId())) {

            throw new RuntimeException(
                    "Un employé ne peut pas se remplacer lui-même"
            );
        }


        if (updated.getEndDate()
                .isBefore(updated.getStartDate())) {

            throw new RuntimeException(
                    "Dates invalides"
            );
        }


        existing.setEmployeeAbsentId(
                absent.getId()
        );

        existing.setEmployeeAbsentName(
                buildName(absent)
        );

        existing.setReplacementEmployeeId(
                replacement.getId()
        );

        existing.setReplacementEmployeeName(
                buildName(replacement)
        );

        existing.setStartDate(
                updated.getStartDate()
        );

        existing.setEndDate(
                updated.getEndDate()
        );

        existing.setTasks(
                updated.getTasks()
        );


        return remplacementRepository.save(
                existing
        );
    }


    // =========================================================
    // Supprimer
    // =========================================================

    public void delete(
            String id,
            String chefEmail
    ) {

        User chef = userRepository
                .findByEmail(chefEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Chef introuvable"
                        )
                );


        Remplacement remplacement =
                remplacementRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Remplacement introuvable"
                                )
                        );


        if (!chef.getDepartment()
                .equals(remplacement.getDepartment())) {

            throw new RuntimeException(
                    "Accès refusé"
            );
        }


        remplacementRepository.deleteById(id);
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