package tn.esprit.twin.backendstiirworkflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class LoginResponse {


    private String token;

    private String role;


}