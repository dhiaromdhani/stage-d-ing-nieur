package tn.esprit.twin.backendstiirworkflow.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "soldes_conges")
public class SoldeConge {

    @Id
    private String id;

    private String userId;
    private int annee;
    private int totalJours;
    private int joursUtilises;
    private int joursRestants;

    public SoldeConge() {}

    public SoldeConge(String userId, int annee, int totalJours) {
        this.userId = userId;
        this.annee = annee;
        this.totalJours = totalJours;
        this.joursUtilises = 0;
        this.joursRestants = totalJours;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public int getAnnee() { return annee; }
    public void setAnnee(int annee) { this.annee = annee; }

    public int getTotalJours() { return totalJours; }
    public void setTotalJours(int totalJours) { this.totalJours = totalJours; }

    public int getJoursUtilises() { return joursUtilises; }
    public void setJoursUtilises(int joursUtilises) { this.joursUtilises = joursUtilises; }

    public int getJoursRestants() { return joursRestants; }
    public void setJoursRestants(int joursRestants) { this.joursRestants = joursRestants; }

    public void recalculer() {
        this.joursRestants = this.totalJours - this.joursUtilises;
    }
}