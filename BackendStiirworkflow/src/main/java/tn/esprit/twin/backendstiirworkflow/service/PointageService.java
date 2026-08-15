package tn.esprit.twin.backendstiirworkflow.service;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.Pointage;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.PointageRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointageService {

    private final PointageRepository pointageRepository;
    private final UserRepository userRepository;

    public Pointage pointerEntree(String emailConnecte) {
        User employe = userRepository.findByEmail(emailConnecte)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        LocalDate aujourdHui = LocalDate.now();
        Pointage pointage = pointageRepository.findByEmployeIdAndDate(employe.getId(), aujourdHui)
                .orElse(new Pointage());

        if (pointage.getId() != null && pointage.getHeureEntree() != null) {
            throw new RuntimeException("Vous avez déjà pointé votre entrée aujourd'hui.");
        }

        pointage.setEmployeId(employe.getId());
        pointage.setDate(aujourdHui);
        pointage.setHeureEntree(LocalDateTime.now());
        pointage.setSource("EMPLOYE");
        if (pointage.getCreatedAt() == null) pointage.setCreatedAt(LocalDateTime.now());

        return pointageRepository.save(pointage);
    }

    public Pointage pointerSortie(String emailConnecte) {
        User employe = userRepository.findByEmail(emailConnecte)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        LocalDate aujourdHui = LocalDate.now();
        Pointage pointage = pointageRepository.findByEmployeIdAndDate(employe.getId(), aujourdHui)
                .orElseThrow(() -> new RuntimeException("Vous devez d'abord pointer votre entrée."));

        if (pointage.getHeureSortie() != null) {
            throw new RuntimeException("Vous avez déjà pointé votre sortie aujourd'hui.");
        }

        pointage.setHeureSortie(LocalDateTime.now());
        return pointageRepository.save(pointage);
    }

    public Pointage pointageManuelRh(String employeId, LocalDate date, LocalDateTime heureEntree, LocalDateTime heureSortie) {
        Pointage pointage = pointageRepository.findByEmployeIdAndDate(employeId, date)
                .orElse(new Pointage());

        pointage.setEmployeId(employeId);
        pointage.setDate(date);
        pointage.setHeureEntree(heureEntree);
        pointage.setHeureSortie(heureSortie);
        pointage.setSource("RH");
        if (pointage.getCreatedAt() == null) pointage.setCreatedAt(LocalDateTime.now());

        return pointageRepository.save(pointage);
    }

    public List<Pointage> getMesPointages(String emailConnecte, LocalDate debut, LocalDate fin) {
        User employe = userRepository.findByEmail(emailConnecte)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
        return pointageRepository.findByEmployeIdAndDateBetween(employe.getId(), debut, fin);
    }

    public List<Pointage> getPointagesEmploye(String employeId, LocalDate debut, LocalDate fin) {
        return pointageRepository.findByEmployeIdAndDateBetween(employeId, debut, fin);
    }
}