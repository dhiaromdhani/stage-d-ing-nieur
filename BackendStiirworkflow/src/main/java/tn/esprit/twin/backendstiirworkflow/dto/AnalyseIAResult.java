package tn.esprit.twin.backendstiirworkflow.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import lombok.Data;

import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyseIAResult {
    private String aiJustification;
    private List<EmployeRecommande> employees;
    private String ocrError;
    private Boolean ocrUsed;
    private String recommendationSummary;
    private Integer requestedCount;
    private String requirementSummary;
    private Integer returnedCount;
    private String skillAnalysis;
    private List<String> targetRoles;
    private List<String> targetSkills;
    private Boolean upskillingMode;
}