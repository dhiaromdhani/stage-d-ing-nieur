package tn.esprit.twin.backendstiirworkflow.security;



import lombok.RequiredArgsConstructor;


import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.core.userdetails.UsernameNotFoundException;


import org.springframework.stereotype.Service;



import tn.esprit.twin.backendstiirworkflow.entity.User;

import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;



@Service
@RequiredArgsConstructor
public class CustomUserDetailsService
        implements UserDetailsService {



    private final UserRepository userRepository;




    @Override
    public UserDetails loadUserByUsername(
            String email
    )
            throws UsernameNotFoundException {



        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () ->
                                        new UsernameNotFoundException(
                                                "Utilisateur non trouvé"
                                        )
                        );




        return org.springframework.security.core.userdetails.User

                .builder()

                .username(
                        user.getEmail()
                )

                .password(
                        user.getPassword()
                )

                .authorities(
                        new SimpleGrantedAuthority(
                                user.getRole().name()
                        )
                )

                .build();


    }


}