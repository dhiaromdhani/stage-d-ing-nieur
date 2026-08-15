package tn.esprit.twin.backendstiirworkflow.repository;

import tn.esprit.twin.backendstiirworkflow.entity.AffectationEmploye;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AffectationEmployeRepository extends MongoRepository<AffectationEmploye, String> {
    List<AffectationEmploye> findByEmployeIdOrderByDateAffectationDesc(String employeId);
    List<AffectationEmploye> findByActiviteId(String activiteId);
    Optional<AffectationEmploye> findByActiviteIdAndEmployeId(String activiteId, String employeId);
}