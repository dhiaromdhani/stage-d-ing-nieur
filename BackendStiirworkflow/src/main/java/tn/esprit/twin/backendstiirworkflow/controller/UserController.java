package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.service.UserService;


import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")

public class UserController {



    private final UserService userService;



    // GET ALL USERS

    @GetMapping

    public ResponseEntity<List<User>> getUsers(){

        return ResponseEntity.ok(
                userService.getAllUsers()
        );

    }



    // GET USER BY ID

    @GetMapping("/{id}")

    public ResponseEntity<User> getUser(@PathVariable String id){


        return userService.getUserById(id)

                .map(ResponseEntity::ok)

                .orElse(ResponseEntity.notFound().build());

    }





    // GET USER BY EMAIL

    @GetMapping("/email/{email}")

    public ResponseEntity<User> getByEmail(
            @PathVariable String email
    ){


        return userService.getUserByEmail(email)

                .map(ResponseEntity::ok)

                .orElse(ResponseEntity.notFound().build());

    }





    // CREATE USER

    @PostMapping

    public ResponseEntity<User> createUser(
            @RequestBody User user
    ){

        return ResponseEntity.ok(
                userService.saveUser(user)
        );

    }





    // UPDATE USER

    @PutMapping("/{id}")

    public ResponseEntity<User> updateUser(

            @PathVariable String id,

            @RequestBody User user

    ){

        return ResponseEntity.ok(
                userService.updateUser(id,user)
        );

    }





    // UPDATE USER SALARY

    @PutMapping("/{id}/salaire")

    public ResponseEntity<User> updateSalary(
            @PathVariable String id,
            @RequestBody Map<String, Double> body
    ){
        Double salaireMensuel = body.get("salaireMensuel");

        if (salaireMensuel == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                userService.updateSalary(id, salaireMensuel)
        );
    }


    // DELETE USER

    @DeleteMapping("/{id}")

    public ResponseEntity<?> deleteUser(
            @PathVariable String id
    ){

        userService.deleteUser(id);

        return ResponseEntity.ok(
                "Utilisateur supprimé"
        );

    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<User>> getUsersByDepartment(
            @PathVariable String department
    ) {

        return ResponseEntity.ok(
                userService.getUsersByDepartment(
                        department
                )
        );
    }


}
