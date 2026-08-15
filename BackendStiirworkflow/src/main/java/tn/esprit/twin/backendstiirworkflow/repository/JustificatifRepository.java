package tn.esprit.twin.backendstiirworkflow.repository;

import tn.esprit.twin.backendstiirworkflow.entity.Justificatif;
import tn.esprit.twin.backendstiirworkflow.entity.StatutJustificatif;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JustificatifRepository extends MongoRepository<Justificatif, String> {
    List<Justificatif> findByEmployeIdOrderByDateSoumissionDesc(String employeId);
    List<Justificatif> findByStatutOrderByDateSoumissionDesc(StatutJustificatif statut);
}