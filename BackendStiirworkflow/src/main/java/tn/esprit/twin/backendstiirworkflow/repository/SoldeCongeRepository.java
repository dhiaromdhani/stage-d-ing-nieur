package tn.esprit.twin.backendstiirworkflow.repository;

import tn.esprit.twin.backendstiirworkflow.model.SoldeConge;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SoldeCongeRepository extends MongoRepository<SoldeConge, String> {
    Optional<SoldeConge> findByUserIdAndAnnee(String userId, int annee);
    List<SoldeConge> findByAnnee(int annee);
}