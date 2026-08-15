package tn.esprit.twin.backendstiirworkflow.repository;

import tn.esprit.twin.backendstiirworkflow.entity.Candidature;
import org.springframework.data.mongodb.repository.MongoRepository;
import tn.esprit.twin.backendstiirworkflow.entity.StatutCandidature;

import java.util.List;
import java.util.Optional;

public interface CandidatureRepository extends MongoRepository<Candidature, String> {
    List<Candidature> findByActiviteId(String activiteId);
    List<Candidature> findByEmployeId(String employeId);
    Optional<Candidature> findByActiviteIdAndEmployeId(String activiteId, String employeId);
    long countByStatut(StatutCandidature statut);

}