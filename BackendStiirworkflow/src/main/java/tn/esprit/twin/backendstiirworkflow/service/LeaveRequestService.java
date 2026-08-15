package tn.esprit.twin.backendstiirworkflow.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import tn.esprit.twin.backendstiirworkflow.dto.LeaveRequestDto;
import tn.esprit.twin.backendstiirworkflow.dto.LeaveResponseDto;
import tn.esprit.twin.backendstiirworkflow.dto.RefuseRequest;
import tn.esprit.twin.backendstiirworkflow.dto.UpdateLeaveStatusRequest;

import tn.esprit.twin.backendstiirworkflow.entity.LeaveRequest;
import tn.esprit.twin.backendstiirworkflow.entity.LeaveStatus;
import tn.esprit.twin.backendstiirworkflow.entity.Role;
import tn.esprit.twin.backendstiirworkflow.entity.User;

import tn.esprit.twin.backendstiirworkflow.repository.LeaveRequestRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;

import tn.esprit.twin.backendstiirworkflow.util.DateUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class LeaveRequestService {


    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveNotificationService notificationService;
    private final UserRepository userRepository;



    /*
     * Création d'une demande de congé
     * par un employé OU par un cadre (Chef/Sous-directeur/Directeur)
     */
    public LeaveResponseDto createLeaveRequest(
            LeaveRequestDto dto,
            String email
    ){


        User employee = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("Utilisateur introuvable")
                );


        LeaveRequest request = new LeaveRequest();


        request.setEmployeeId(employee.getId());

        request.setEmployeeName(
                employee.getFirstName() + " " + employee.getLastName()
        );

        request.setStartDate(dto.getStartDate());

        request.setEndDate(dto.getEndDate());

        request.setReason(dto.getReason());

        request.setNbJours(
                DateUtils.joursOuvres(dto.getStartDate(), dto.getEndDate())
        );


        // Statut initial : un cadre saute directement à la validation RH
        LeaveStatus statutInitial = determinerStatutInitial(employee.getRole());

        request.setStatus(statutInitial);


        request.setCreatedAt(
                LocalDateTime.now()
        );


        LeaveRequest saved =
                leaveRequestRepository.save(request);


        String nomComplet =
                employee.getFirstName() + " " + employee.getLastName();

        if (statutInitial == LeaveStatus.PENDING_RH) {
            notificationService.notifyRH(nomComplet);
        } else {
            notificationService.notifyChef(nomComplet);
        }


        return mapToDto(saved, employee);

    }


    /*
     * Détermine à quelle étape du workflow démarre la demande.
     * Un Chef, Sous-directeur ou Directeur qui pose son propre congé
     * saute directement à PENDING_RH : seul le RH confirme.
     * Un employé normal (ROLE_EMPLOYEE) démarre comme avant à PENDING_CHEF.
     */
    private LeaveStatus determinerStatutInitial(Role role) {

        switch (role) {

            case ROLE_CHEF:
            case ROLE_SOUS_DIRECTEUR:
            case ROLE_DIRECTEUR:
                return LeaveStatus.PENDING_RH;

            default:
                return LeaveStatus.PENDING_CHEF;
        }
    }



    /*
     * Récupérer les demandes d'un employé
     */
    public List<LeaveResponseDto> getMyLeaves(String email){


        User employee =
                userRepository.findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException("Utilisateur introuvable")
                        );


        return leaveRequestRepository
                .findByEmployeeId(employee.getId())
                .stream()
                .map(
                        leave ->
                                mapToDto(leave, employee)
                )
                .collect(Collectors.toList());

    }




    /*
     * Récupérer toutes les demandes
     * pour Chef, Directeur, RH, Admin
     */
    public List<LeaveResponseDto> getAllLeaves(){


        return leaveRequestRepository
                .findAll()
                .stream()
                .map(
                        leave -> {

                            User user =
                                    userRepository
                                            .findById(
                                                    leave.getEmployeeId()
                                            )
                                            .orElse(null);


                            return mapToDto(
                                    leave,
                                    user
                            );

                        }
                )
                .collect(Collectors.toList());

    }




    /*
     * Validation d'une demande
     */
    public LeaveResponseDto approveLeave(
            String leaveId,
            String role,
            UpdateLeaveStatusRequest request
    ){


        LeaveRequest leave =
                leaveRequestRepository
                        .findById(leaveId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Demande introuvable"
                                )
                        );


        switch(role){


            case "ROLE_CHEF":

                checkStatus(
                        leave,
                        LeaveStatus.PENDING_CHEF
                );


                leave.setStatus(
                        LeaveStatus.PENDING_SOUS_DIRECTEUR
                );

                break;



            case "ROLE_SOUS_DIRECTEUR":


                checkStatus(
                        leave,
                        LeaveStatus.PENDING_SOUS_DIRECTEUR
                );


                leave.setStatus(
                        LeaveStatus.PENDING_DIRECTEUR
                );

                break;




            case "ROLE_DIRECTEUR":


                checkStatus(
                        leave,
                        LeaveStatus.PENDING_DIRECTEUR
                );


                leave.setStatus(
                        LeaveStatus.PENDING_RH
                );


                break;




            case "ROLE_RH":


                checkStatus(
                        leave,
                        LeaveStatus.PENDING_RH
                );


                leave.setStatus(
                        LeaveStatus.APPROVED
                );


                break;



            default:

                throw new RuntimeException(
                        "Rôle non autorisé"
                );

        }


        leave.setComment(
                request.getComment()
        );


        LeaveRequest saved =
                leaveRequestRepository.save(leave);



        User user =
                userRepository.findById(
                        saved.getEmployeeId()
                ).orElse(null);



        return mapToDto(saved,user);

    }






    /*
     * Refus d'une demande
     */
    public LeaveResponseDto refuseLeave(
            String leaveId,
            String role,
            RefuseRequest request
    ){


        if(request.getComment()==null ||
                request.getComment().isEmpty()){


            throw new RuntimeException(
                    "Le commentaire de refus est obligatoire"
            );

        }



        LeaveRequest leave =
                leaveRequestRepository
                        .findById(leaveId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Demande introuvable"
                                )
                        );



        switch(role){


            case "ROLE_CHEF":

                leave.setStatus(
                        LeaveStatus.REFUSED_CHEF
                );

                break;



            case "ROLE_SOUS_DIRECTEUR":

                leave.setStatus(
                        LeaveStatus.REFUSED_SOUS_DIRECTEUR
                );

                break;



            case "ROLE_DIRECTEUR":

                leave.setStatus(
                        LeaveStatus.REFUSED_DIRECTEUR
                );

                break;



            case "ROLE_RH":

                leave.setStatus(
                        LeaveStatus.REFUSED_RH
                );

                break;



            default:

                throw new RuntimeException(
                        "Rôle non autorisé"
                );

        }



        leave.setComment(
                request.getComment()
        );



        LeaveRequest saved =
                leaveRequestRepository.save(leave);



        User user =
                userRepository.findById(
                        saved.getEmployeeId()
                ).orElse(null);



        return mapToDto(saved,user);


    }






    /*
     * Vérification étape workflow
     */
    private void checkStatus(
            LeaveRequest leave,
            LeaveStatus expected
    ){


        if(leave.getStatus()!=expected){


            throw new RuntimeException(
                    "Cette demande n'est pas dans cette étape du workflow"
            );

        }

    }





    /*
     * Conversion Entity -> DTO
     */
    private LeaveResponseDto mapToDto(
            LeaveRequest leave,
            User user
    ){


        return LeaveResponseDto.builder()

                .id(leave.getId())

                .employeeId(
                        leave.getEmployeeId()
                )

                .employeeName(
                        user != null ?
                                user.getFirstName()
                                        +" "
                                        +user.getLastName()
                                :
                                "Inconnu"
                )

                .startDate(
                        leave.getStartDate()
                )

                .endDate(
                        leave.getEndDate()
                )

                .reason(
                        leave.getReason()
                )

                .status(
                        leave.getStatus().name()
                )

                .comment(
                        leave.getComment()
                )

                .createdAt(
                        leave.getCreatedAt()
                )

                .role(
                        user != null ? user.getRole().name() : null
                )

                .build();

    }

    public List<LeaveResponseDto> getLeavesByStatus(String status) {

        LeaveStatus leaveStatus = LeaveStatus.valueOf(status);

        return leaveRequestRepository
                .findByStatus(leaveStatus)
                .stream()
                .map(leave -> {

                    User user = userRepository
                            .findById(leave.getEmployeeId())
                            .orElse(null);

                    return mapToDto(leave, user);

                })
                .toList();

    }

}