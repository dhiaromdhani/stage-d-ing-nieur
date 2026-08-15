package tn.esprit.twin.backendstiirworkflow.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


import lombok.RequiredArgsConstructor;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.core.userdetails.UserDetails;


import org.springframework.stereotype.Component;


import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;



@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {



    private final JwtService jwtService;


    private final CustomUserDetailsService userDetailsService;



    private static final Logger LOGGER =
            LoggerFactory.getLogger(
                    JwtAuthenticationFilter.class
            );




    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    )
            throws ServletException, IOException {



        String authHeader =
                request.getHeader(
                        "Authorization"
                );



        LOGGER.info(
                "REQUEST : {} {}",
                request.getMethod(),
                request.getRequestURI()
        );



        LOGGER.info(
                "AUTH HEADER : {}",
                authHeader
        );




        if(authHeader == null ||
                !authHeader.startsWith("Bearer ")) {



            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }




        String token =
                authHeader.substring(7);



        try {



            String email =
                    jwtService.extractUsername(token);



            LOGGER.info(
                    "JWT USER : {}",
                    email
            );



            if(email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication()
                            == null) {



                boolean valid =
                        jwtService.isTokenValid(token);



                LOGGER.info(
                        "TOKEN VALID : {}",
                        valid
                );



                if(valid) {



                    UserDetails userDetails =
                            userDetailsService
                                    .loadUserByUsername(
                                            email
                                    );



                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );



                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );



                    LOGGER.info(
                            "AUTHENTICATED : {}",
                            email
                    );

                }

            }



        }
        catch(Exception e){


            LOGGER.error(
                    "JWT ERROR : {}",
                    e.getMessage()
            );

        }




        LOGGER.info(
                "SECURITY CONTEXT : {}",
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
        );



        filterChain.doFilter(
                request,
                response
        );

    }

}