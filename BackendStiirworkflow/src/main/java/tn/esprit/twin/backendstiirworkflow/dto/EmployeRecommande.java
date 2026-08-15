package tn.esprit.twin.backendstiirworkflow.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import lombok.Data;

import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@JsonIgnoreProperties(ignoreUnknown = true)
public class EmployeRecommande {
    private String currentSkills;
    private String id; // id Mongo réel de l'employé (String, pas Integer)
    private String jobTitle;
    private Integer missingSkillCount;
    private List<String> missingSkills;
    private String name;
    private Double relatedSkillCoverage;
    private Double roleSimilarity;
    private Double score;
    private Double skillCoverage;
}