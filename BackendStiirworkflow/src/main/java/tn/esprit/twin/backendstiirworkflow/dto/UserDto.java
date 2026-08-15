package tn.esprit.twin.backendstiirworkflow.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserDto {

    private String id;

    private String matricule;

    private String firstName;

    private String lastName;

    private String email;

    private String department;

    private String role;

}