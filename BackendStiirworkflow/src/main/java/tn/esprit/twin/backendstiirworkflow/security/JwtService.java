package tn.esprit.twin.backendstiirworkflow.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import tn.esprit.twin.backendstiirworkflow.entity.User;

import javax.crypto.SecretKey;
import java.util.Date;



@Service
public class JwtService {


    private static final String SECRET_KEY =
            "STIIRWORKFLOWSECRETKEY2026STIIRWORKFLOWSECRETKEY2026";

    private SecretKey getSignKey() {
        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes()
        );
    }


    public String generateToken(User user){


        return Jwts.builder()

                .setSubject(user.getEmail())

                .claim(
                        "role",
                        user.getRole().name()
                )

                .setIssuedAt(
                        new Date()
                )

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 86400000
                        )
                )

                .signWith(
                        getSignKey(),
                        SignatureAlgorithm.HS256
                )

                .compact();
    }



    public String extractUsername(String token){


        Claims claims =
                Jwts.parserBuilder()

                        .setSigningKey(getSignKey())

                        .build()

                        .parseClaimsJws(token)

                        .getBody();


        return claims.getSubject();

    }



    public boolean isTokenValid(String token){

        try{

            extractUsername(token);

            return true;

        }
        catch(Exception e){

            return false;

        }

    }

}