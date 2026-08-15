package tn.esprit.twin.backendstiirworkflow.repository;

import tn.esprit.twin.backendstiirworkflow.entity.LeaveRequest;
import tn.esprit.twin.backendstiirworkflow.entity.LeaveStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends MongoRepository<LeaveRequest, String> {

    List<LeaveRequest> findByEmployeeId(String employeeId);

    List<LeaveRequest> findByStatus(LeaveStatus status);

}