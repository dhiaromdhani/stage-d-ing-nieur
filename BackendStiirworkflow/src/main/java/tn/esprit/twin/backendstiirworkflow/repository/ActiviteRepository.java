package tn.esprit.twin.backendstiirworkflow.repository;

import tn.esprit.twin.backendstiirworkflow.entity.Activite;
import tn.esprit.twin.backendstiirworkflow.entity.ActiviteType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ActiviteRepository extends MongoRepository<Activite, String> {
    List<Activite> findByType(ActiviteType type);
    List<Activite> findByDepartmentsCiblesContaining(String department);
}