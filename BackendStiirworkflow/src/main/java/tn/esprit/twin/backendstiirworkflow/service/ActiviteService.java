package tn.esprit.twin.backendstiirworkflow.service;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.dto.AnalyseIAResult;
import tn.esprit.twin.backendstiirworkflow.entity.*;
import tn.esprit.twin.backendstiirworkflow.repository.ActiviteRepository;
import tn.esprit.twin.backendstiirworkflow.repository.AffectationEmployeRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActiviteService {

    private final ActiviteRepository activiteRepository;
    private final UserRepository userRepository;
    private final AffectationEmployeRepository affectationEmployeRepository;
    private final PythonRecommendationClient pythonClient;
    private final NotificationService notificationService;

    public Activite createActivite(Activite activite, String rhUserId) {
        activite.setCreatedByUserId(rhUserId);
        activite.setCreatedAt(LocalDate.now());

        Activite saved = activiteRepository.save(activite);

        List<User> employesPotentiels = userRepository.findAll().stream()
                .filter(u -> "ROLE_EMPLOYEE".equals(u.getRole() != null ? u.getRole().name() : null))
                .filter(u -> activite.getDepartmentsCibles() == null
                        || activite.getDepartmentsCibles().isEmpty()
                        || activite.getDepartmentsCibles().contains(u.getDepartment()))
                .collect(Collectors.toList());

        List<Map<String, Object>> employesPayload = employesPotentiels.stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("name", u.getFirstName() + " " + u.getLastName());
            m.put("jobTitle", u.getJobTitle());
            m.put("skills", u.getSkills());
            m.put("department", u.getDepartment());
            m.put("anneesExperience", u.getAnneesExperience());
            m.put("niveauPoste", u.getNiveauPoste());
            m.put("specialite", u.getSpecialite());
            m.put("estManager", u.getEstManager());
            m.put("tailleEquipe", u.getTailleEquipe());
            return m;
        }).collect(Collectors.toList());

        String prompt = construirePrompt(saved);
        AnalyseIAResult resultat = pythonClient.analyser(prompt, employesPayload);

        saved.setAnalyseIA(resultat);
        saved.setAffectationConfirmee(false);

        return activiteRepository.save(saved);
    }

    public Activite confirmerAffectation(String activiteId, List<String> employeIds) {
        Activite activite = activiteRepository.findById(activiteId)
                .orElseThrow(() -> new RuntimeException("Activité introuvable"));

        if (Boolean.TRUE.equals(activite.getAffectationConfirmee())) {
            throw new RuntimeException("Cette affectation a déjà été confirmée.");
        }

        List<User> usersAffectes = new ArrayList<>();
        for (String id : employeIds) {
            userRepository.findById(id).ifPresent(usersAffectes::add);
        }

        if (usersAffectes.isEmpty()) {
            throw new RuntimeException("Sélectionnez au moins un employé avant de confirmer.");
        }

        for (User employe : usersAffectes) {
            AffectationEmploye affectation = new AffectationEmploye();
            affectation.setActiviteId(activite.getId());
            affectation.setActiviteTitre(activite.getTitre());
            affectation.setEmployeId(employe.getId());
            affectation.setEmployeNom(employe.getFirstName() + " " + employe.getLastName());
            affectation.setStatut(StatutAffectation.EN_ATTENTE);
            affectation.setDateAffectation(LocalDateTime.now());
            AffectationEmploye savedAffectation = affectationEmployeRepository.save(affectation);

            notificationService.notifierAffectationAvecReponse(employe, activite, savedAffectation);
        }

        activite.setEmployesAffectesIds(employeIds);
        activite.setAffectationConfirmee(true);

        return activiteRepository.save(activite);
    }

    public AffectationEmploye repondreAffectation(String affectationId, String emailEmploye, StatutAffectation statut) {
        AffectationEmploye affectation = affectationEmployeRepository.findById(affectationId)
                .orElseThrow(() -> new RuntimeException("Affectation introuvable"));

        User employe = userRepository.findByEmail(emailEmploye)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));

        if (!affectation.getEmployeId().equals(employe.getId())) {
            throw new RuntimeException("Vous n'êtes pas autorisé à répondre à cette affectation.");
        }

        if (affectation.getStatut() != StatutAffectation.EN_ATTENTE) {
            throw new RuntimeException("Vous avez déjà répondu à cette affectation.");
        }

        affectation.setStatut(statut);
        affectation.setDateReponse(LocalDateTime.now());
        AffectationEmploye updated = affectationEmployeRepository.save(affectation);

        Activite activite = activiteRepository.findById(affectation.getActiviteId()).orElse(null);
        if (activite != null) {
            userRepository.findByEmail(activite.getCreatedByUserId())
                    .ifPresent(rh -> notificationService.notifierReponseAffectation(rh, employe, activite, updated));
        }

        return updated;
    }

    public List<AffectationEmploye> getMesAffectations(String emailEmploye) {
        User employe = userRepository.findByEmail(emailEmploye)
                .orElseThrow(() -> new RuntimeException("Employé introuvable"));
        return affectationEmployeRepository.findByEmployeIdOrderByDateAffectationDesc(employe.getId());
    }

    public List<AffectationEmploye> getAffectationsParActivite(String activiteId) {
        return affectationEmployeRepository.findByActiviteId(activiteId);
    }

    public Activite updateActivite(String id, Activite activiteRequest) {
        Activite existante = activiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activité introuvable"));

        existante.setTitre(activiteRequest.getTitre());
        existante.setDescription(activiteRequest.getDescription());
        existante.setType(activiteRequest.getType());
        existante.setDepartmentsCibles(activiteRequest.getDepartmentsCibles());
        existante.setCompetencesRequises(activiteRequest.getCompetencesRequises());
        existante.setNombreEmployesSouhaite(activiteRequest.getNombreEmployesSouhaite());
        existante.setLieu(activiteRequest.getLieu());
        existante.setDateDebut(activiteRequest.getDateDebut());
        existante.setDateFin(activiteRequest.getDateFin());
        existante.setPlacesDisponibles(activiteRequest.getPlacesDisponibles());
        existante.setConditions(activiteRequest.getConditions());

        return activiteRepository.save(existante);
    }

    private String construirePrompt(Activite a) {
        StringBuilder sb = new StringBuilder("Trouver ");
        sb.append(a.getNombreEmployesSouhaite() != null ? a.getNombreEmployesSouhaite() : 5);
        sb.append(" employés");

        if (a.getCompetencesRequises() != null && !a.getCompetencesRequises().isEmpty()) {
            sb.append(" ayant des compétences en ")
                    .append(String.join(", ", a.getCompetencesRequises()));
        }

        if (a.getDepartmentsCibles() != null && !a.getDepartmentsCibles().isEmpty()) {
            sb.append(" dans le(s) métier(s) ")
                    .append(String.join(", ", a.getDepartmentsCibles()));
        }

        sb.append(" pour participer à ").append(a.getType() != null ? a.getType().name().toLowerCase() : "l'activité");
        sb.append(" \"").append(a.getTitre()).append("\"");

        return sb.toString();
    }

    public List<Activite> getAllActivites() {
        return activiteRepository.findAll();
    }

    public List<Activite> getActivitesByType(ActiviteType type) {
        return activiteRepository.findByType(type);
    }

    public Activite getActiviteById(String id) {
        return activiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activité introuvable"));
    }

    public void deleteActivite(String id) {
        activiteRepository.deleteById(id);
    }
}