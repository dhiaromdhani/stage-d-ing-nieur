package tn.esprit.twin.backendstiirworkflow.repository;

import tn.esprit.twin.backendstiirworkflow.entity.Pointage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PointageRepository extends MongoRepository<Pointage, String> {
    Optional<Pointage> findByEmployeIdAndDate(String employeId, LocalDate date);
    List<Pointage> findByEmployeIdAndDateBetween(String employeId, LocalDate debut, LocalDate fin);
}