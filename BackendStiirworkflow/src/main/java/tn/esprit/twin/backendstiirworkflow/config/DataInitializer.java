package tn.esprit.twin.backendstiirworkflow.config;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.password.PasswordEncoder;

import tn.esprit.twin.backendstiirworkflow.entity.Role;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner init(UserRepository repository) {

        return args -> {

            if (repository.count() == 0) {

                repository.save(User.builder()
                        .matricule("EMP001")
                        .firstName("Ali")
                        .lastName("Ben Salah")
                        .email("employe@stir.tn")
                        .password(passwordEncoder.encode("123456"))
                        .department("Production")
                        .role(Role.ROLE_EMPLOYEE)
                        .build());

                repository.save(User.builder()
                        .matricule("CHF001")
                        .firstName("Mohamed")
                        .lastName("Chef")
                        .email("chef@stir.tn")
                        .password(passwordEncoder.encode("123456"))
                        .department("Production")
                        .role(Role.ROLE_CHEF)
                        .build());

                repository.save(User.builder()
                        .matricule("SD001")
                        .firstName("Ahmed")
                        .lastName("Sous")
                        .email("sous@stir.tn")
                        .password(passwordEncoder.encode("123456"))
                        .department("Production")
                        .role(Role.ROLE_SOUS_DIRECTEUR)
                        .build());

                repository.save(User.builder()
                        .matricule("DIR001")
                        .firstName("Karim")
                        .lastName("Directeur")
                        .email("directeur@stir.tn")
                        .password(passwordEncoder.encode("123456"))
                        .department("Direction")
                        .role(Role.ROLE_DIRECTEUR)
                        .build());

                repository.save(User.builder()
                        .matricule("RH001")
                        .firstName("Sana")
                        .lastName("RH")
                        .email("rh@stir.tn")
                        .password(passwordEncoder.encode("123456"))
                        .department("RH")
                        .role(Role.ROLE_RH)
                        .build());

                repository.save(User.builder()
                        .matricule("ADM001")
                        .firstName("Admin")
                        .lastName("System")
                        .email("admin@stir.tn")
                        .password(passwordEncoder.encode("123456"))
                        .department("IT")
                        .role(Role.ROLE_ADMIN)
                        .build());

            }

        };

    }

}