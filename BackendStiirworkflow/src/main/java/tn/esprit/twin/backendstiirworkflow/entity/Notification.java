package tn.esprit.twin.backendstiirworkflow.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    private String userId;
    private String activiteId;
    private String candidatureId; // rempli uniquement pour les notifications de candidature
    private String titre;
    private String message;
    private String type;          // "AFFECTATION", "CANDIDATURE", "RESULTAT_CANDIDATURE"
    private boolean lue;
    private LocalDateTime createdAt;
}