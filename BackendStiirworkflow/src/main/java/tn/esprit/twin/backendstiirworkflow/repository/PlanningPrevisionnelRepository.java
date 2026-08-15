package tn.esprit.twin.backendstiirworkflow.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import tn.esprit.twin.backendstiirworkflow.entity.PlanningPrevisionnel;
import tn.esprit.twin.backendstiirworkflow.entity.PlanningStatus;

import java.util.List;

@Repository
public interface PlanningPrevisionnelRepository
        extends MongoRepository<PlanningPrevisionnel, String> {

    List<PlanningPrevisionnel>
    findByDepartment(String department);

    List<PlanningPrevisionnel>
    findByEmployeeId(String employeeId);

    List<PlanningPrevisionnel>
    findByDepartmentAndStatus(
            String department,
            PlanningStatus status
    );
}