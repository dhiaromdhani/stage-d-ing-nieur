package tn.esprit.twin.backendstiirworkflow.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;



    // Récupérer tous les utilisateurs

    public List<User> getAllUsers(){

        return userRepository.findAll();

    }



    // Récupérer utilisateur par ID

    public Optional<User> getUserById(String id){

        return userRepository.findById(id);

    }



    // Récupérer utilisateur par email

    public Optional<User> getUserByEmail(String email){

        return userRepository.findByEmail(email);

    }



    // Ajouter utilisateur

    public User saveUser(User user){

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);

    }



    // Modifier utilisateur

    public User updateUser(String id, User newUser){


        return userRepository.findById(id)

                .map(user -> {


                    user.setFirstName(newUser.getFirstName());
                    user.setLastName(newUser.getLastName());
                    user.setEmail(newUser.getEmail());
                    user.setRole(newUser.getRole());
                    user.setDepartment(newUser.getDepartment());

                    if (newUser.getPassword() != null && !newUser.getPassword().isBlank()) {
                        user.setPassword(passwordEncoder.encode(newUser.getPassword()));
                    }

                    return userRepository.save(user);


                })

                .orElseThrow(
                        () -> new RuntimeException("Utilisateur introuvable")
                );


    }


    // Mettre à jour le salaire mensuel

    public User updateSalary(String id, Double salaireMensuel){

        return userRepository.findById(id)

                .map(user -> {
                    user.setSalaireMensuel(salaireMensuel);
                    return userRepository.save(user);
                })

                .orElseThrow(
                        () -> new RuntimeException("Utilisateur introuvable")
                );
    }


    // Supprimer utilisateur

    public void deleteUser(String id){

        userRepository.deleteById(id);

    }

    public List<User> getUsersByDepartment(
            String department
    ) {

        return userRepository.findByDepartment(
                department
        );
    }


}
