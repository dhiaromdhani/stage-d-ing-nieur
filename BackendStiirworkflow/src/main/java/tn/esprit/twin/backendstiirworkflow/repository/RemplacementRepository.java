package tn.esprit.twin.backendstiirworkflow.repository;

import tn.esprit.twin.backendstiirworkflow.entity.Remplacement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemplacementRepository
        extends MongoRepository<Remplacement, String> {

    List<Remplacement> findByDepartment(String department);

    List<Remplacement> findByEmployeeAbsentId(String employeeAbsentId);

    List<Remplacement> findByReplacementEmployeeId(String replacementEmployeeId);

}