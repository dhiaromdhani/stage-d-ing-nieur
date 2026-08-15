package tn.esprit.twin.backendstiirworkflow.security;


import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;


import tn.esprit.twin.backendstiirworkflow.dto.LoginRequest;
import tn.esprit.twin.backendstiirworkflow.dto.LoginResponse;

import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;



@Service
@RequiredArgsConstructor
public class AuthenticationService {



    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    private final JwtService jwtService;




    public LoginResponse login(LoginRequest request){


        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        request.getEmail(),

                        request.getPassword()

                )

        );



        User user =
                userRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow();



        String token =
                jwtService.generateToken(user);



        return new LoginResponse(

                token,

                user.getRole().name()

        );


    }


}