package tn.esprit.twin.backendstiirworkflow.service;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.dto.RapportAbsence;
import tn.esprit.twin.backendstiirworkflow.entity.*;
import tn.esprit.twin.backendstiirworkflow.repository.*;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AbsenceService {

    private static final double JOURS_OUVRES_PAR_MOIS = 22.0;

    private final UserRepository userRepository;
    private final PointageRepository pointageRepository;
    private final JustificatifRepository justificatifRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public RapportAbsence calculerRapport(String employeId, LocalDate debut, LocalDate fin) {
        User employe = userRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        List<Pointage> pointages = pointageRepository.findByEmployeIdAndDateBetween(employeId, debut, fin);

        List<Justificatif> justificatifsValides = justificatifRepository
                .findByEmployeIdOrderByDateSoumissionDesc(employeId).stream()
                .filter(j -> j.getStatut() == StatutJustificatif.VALIDE)
                .toList();

        List<LeaveRequest> congesApprouves = leaveRequestRepository.findByEmployeeId(employeId).stream()
                .filter(l -> l.getStatus() == LeaveStatus.APPROVED)
                .toList();

        double salaireMensuel = employe.getSalaireMensuel() != null ? employe.getSalaireMensuel() : 0.0;
        double salaireJournalier = salaireMensuel / JOURS_OUVRES_PAR_MOIS;

        int joursOuvres = 0;
        int joursPresents = 0;
        int joursConge = 0;
        int joursJustifies = 0;
        List<LocalDate> absencesNonJustifiees = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (LocalDate jour = debut; !jour.isAfter(fin) && !jour.isAfter(today); jour = jour.plusDays(1)) {
            if (jour.getDayOfWeek() == DayOfWeek.SATURDAY || jour.getDayOfWeek() == DayOfWeek.SUNDAY) {
                continue;
            }
            joursOuvres++;

            final LocalDate jourFinal = jour;

            boolean aPointe = pointages.stream()
                    .anyMatch(p -> p.getDate().equals(jourFinal) && p.getHeureEntree() != null);

            boolean estEnConge = congesApprouves.stream()
                    .anyMatch(l -> !jourFinal.isBefore(l.getStartDate()) && !jourFinal.isAfter(l.getEndDate()));

            boolean estJustifie = justificatifsValides.stream()
                    .anyMatch(j -> !jourFinal.isBefore(j.getDateDebut()) && !jourFinal.isAfter(j.getDateFin()));

            if (aPointe) {
                joursPresents++;
            } else if (estEnConge) {
                joursConge++;
            } else if (estJustifie) {
                joursJustifies++;
            } else {
                absencesNonJustifiees.add(jourFinal);
            }
        }

        int nbAbsencesNonJustifiees = absencesNonJustifiees.size();
        double montantRetenue = Math.round(salaireJournalier * nbAbsencesNonJustifiees * 1000.0) / 1000.0;
        double salaireNetEstime = Math.round((salaireMensuel - montantRetenue) * 1000.0) / 1000.0;

        RapportAbsence rapport = new RapportAbsence();
        rapport.setEmployeId(employeId);
        rapport.setEmployeNom(employe.getFirstName() + " " + employe.getLastName());
        rapport.setSalaireMensuel(salaireMensuel);
        rapport.setSalaireJournalier(Math.round(salaireJournalier * 1000.0) / 1000.0);
        rapport.setJoursOuvresDansLePeriode(joursOuvres);
        rapport.setJoursPresents(joursPresents);
        rapport.setJoursCongeApprouve(joursConge);
        rapport.setJoursJustifies(joursJustifies);
        rapport.setJoursAbsenceNonJustifiee(nbAbsencesNonJustifiees);
        rapport.setDatesAbsenceNonJustifiee(absencesNonJustifiees);
        rapport.setMontantRetenue(montantRetenue);
        rapport.setSalaireNetEstime(salaireNetEstime);

        return rapport;
    }

    public List<RapportAbsence> calculerRapportTous(LocalDate debut, LocalDate fin) {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && "ROLE_EMPLOYEE".equals(u.getRole().name()))
                .map(u -> calculerRapport(u.getId(), debut, fin))
                .toList();
    }
}