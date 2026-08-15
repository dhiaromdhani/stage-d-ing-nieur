package tn.esprit.twin.backendstiirworkflow.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.esprit.twin.backendstiirworkflow.dto.LoginRequest;
import tn.esprit.twin.backendstiirworkflow.dto.LoginResponse;
import tn.esprit.twin.backendstiirworkflow.security.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authenticationService.login(request)
        );

    }

}
