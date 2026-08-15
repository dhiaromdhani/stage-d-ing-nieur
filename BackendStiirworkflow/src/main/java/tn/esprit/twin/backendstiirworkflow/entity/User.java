package tn.esprit.twin.backendstiirworkflow.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "users")

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@Builder

public class User {

    @Id
    private String id;

    private String matricule;

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String department;

    private Role role;

    private String jobTitle;
    private List<String> skills;

    private Double salaireMensuel; // en dinars tunisiens

    private Integer anneesExperience;   // ex: 5
    private String niveauPoste;         // ex: "Technicien", "Ingénieur", "Manager", "Cadre"
    private String specialite;          // ex: "Développement", "DevOps", "Cloud", "Réseau", "Sécurité"
    private Boolean estManager;         // true si encadre une équipe
    private Integer tailleEquipe;       // nombre de personnes encadrées, si estManager = true

    public Integer getAnneesExperience() { return anneesExperience; }
    public void setAnneesExperience(Integer anneesExperience) { this.anneesExperience = anneesExperience; }

    public String getNiveauPoste() { return niveauPoste; }
    public void setNiveauPoste(String niveauPoste) { this.niveauPoste = niveauPoste; }

    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }

    public Boolean getEstManager() { return estManager; }
    public void setEstManager(Boolean estManager) { this.estManager = estManager; }

    public Integer getTailleEquipe() { return tailleEquipe; }
    public void setTailleEquipe(Integer tailleEquipe) { this.tailleEquipe = tailleEquipe; }

    public Double getSalaireMensuel() { return salaireMensuel; }
    public void setSalaireMensuel(Double salaireMensuel) { this.salaireMensuel = salaireMensuel; }

    // getters/setters existants + pour jobTitle et skills
    // public String getJobTitle() { return jobTitle; }
    // public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    // public List<String> getSkills() { return skills; }
    // public void setSkills(List<String> skills) { this.skills = skills; }


}
