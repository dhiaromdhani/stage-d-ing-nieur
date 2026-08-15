package tn.esprit.twin.backendstiirworkflow.repository;

import tn.esprit.twin.backendstiirworkflow.entity.ConversionConge;
import tn.esprit.twin.backendstiirworkflow.entity.StatutConversion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ConversionCongeRepository extends MongoRepository<ConversionConge, String> {
    List<ConversionConge> findByEmployeIdOrderByDateDemandeDesc(String employeId);
    List<ConversionConge> findByStatutOrderByDateDemandeDesc(StatutConversion statut);
}