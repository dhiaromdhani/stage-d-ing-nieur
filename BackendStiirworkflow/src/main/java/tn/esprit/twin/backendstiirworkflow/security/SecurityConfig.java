package tn.esprit.twin.backendstiirworkflow.security;


import lombok.RequiredArgsConstructor;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import org.springframework.http.HttpMethod;


import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;


import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.CorsConfigurationSource;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import java.util.List;



@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {



    private final JwtAuthenticationFilter jwtFilter;




    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {



        return http



                // Désactiver CSRF pour API REST JWT
                .csrf(csrf -> csrf.disable())



                // Activer CORS
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )



                // Pas de session serveur
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )



                .authorizeHttpRequests(auth -> auth



                        // Requête OPTIONS navigateur
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()



                        // Login / Register
                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()



                        // IMPORTANT :
                        // éviter le 403 caché sur /error
                        .requestMatchers(
                                "/error"
                        )
                        .permitAll()



                        // API congés protégée par JWT
                        .requestMatchers(
                                "/api/leaves/**"
                        )
                        .authenticated()


                        .requestMatchers(
                                "/api/remplacements/**"
                        ).authenticated()

                        .requestMatchers(
                                "/api/planning-previsionnel/**"
                        ).authenticated()
                        // Toutes les autres API
                        .requestMatchers(
                                "/api/**"
                        )
                        .authenticated()



                        // reste
                        .anyRequest()
                        .permitAll()


                )





                // Filtre JWT avant UsernamePasswordAuthenticationFilter
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                )



                .build();

    }







    @Bean
    public CorsConfigurationSource corsConfigurationSource(){


        CorsConfiguration configuration =
                new CorsConfiguration();



        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );



        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );



        configuration.setAllowedHeaders(
                List.of("*")
        );



        configuration.setAllowCredentials(true);



        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );



        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();



        source.registerCorsConfiguration(
                "/**",
                configuration
        );



        return source;

    }







    @Bean
    public PasswordEncoder passwordEncoder(){


        return new BCryptPasswordEncoder();

    }








    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception{


        return configuration.getAuthenticationManager();

    }



}