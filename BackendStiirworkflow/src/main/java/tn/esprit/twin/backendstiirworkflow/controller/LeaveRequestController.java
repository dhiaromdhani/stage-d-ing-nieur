package tn.esprit.twin.backendstiirworkflow.controller;



import lombok.RequiredArgsConstructor;


import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.Authentication;


import org.springframework.web.bind.annotation.*;


import tn.esprit.twin.backendstiirworkflow.dto.LeaveRequestDto;

import tn.esprit.twin.backendstiirworkflow.dto.LeaveResponseDto;

import tn.esprit.twin.backendstiirworkflow.dto.RefuseRequest;

import tn.esprit.twin.backendstiirworkflow.dto.UpdateLeaveStatusRequest;


import tn.esprit.twin.backendstiirworkflow.service.LeaveRequestService;



import java.util.List;



@RestController

@RequestMapping("/api/leaves")

@RequiredArgsConstructor

@CrossOrigin(
        origins = "http://localhost:5173"
)

public class LeaveRequestController {




    private final LeaveRequestService leaveRequestService;




    @PostMapping("/create")

    @PreAuthorize(
            "hasAnyRole('EMPLOYEE','CHEF','SOUS_DIRECTEUR','DIRECTEUR','RH','ADMIN')"
    )

    public LeaveResponseDto createLeave(

            @RequestBody LeaveRequestDto dto,

            Authentication authentication

    ){



        System.out.println(
                "===== CREATE LEAVE ====="
        );


        System.out.println(
                "AUTH = "
                        + authentication
        );


        System.out.println(
                "AUTHORITIES = "
                        + authentication.getAuthorities()
        );



        return leaveRequestService.createLeaveRequest(

                dto,

                authentication.getName()

        );


    }






    @GetMapping("/my")

    public List<LeaveResponseDto> getMyLeaves(
            Authentication authentication
    ){


        return leaveRequestService
                .getMyLeaves(
                        authentication.getName()
                );

    }






    @GetMapping("/all")

    @PreAuthorize(
            "hasAnyRole('CHEF','SOUS_DIRECTEUR','DIRECTEUR','RH','ADMIN')"
    )

    public List<LeaveResponseDto> getAllLeaves(){


        return leaveRequestService.getAllLeaves();

    }





    @GetMapping("/status/{status}")

    @PreAuthorize(
            "hasAnyRole('CHEF','SOUS_DIRECTEUR','DIRECTEUR','RH','ADMIN')"
    )

    public List<LeaveResponseDto> getLeavesByStatus(
            @PathVariable String status
    ){


        return leaveRequestService
                .getLeavesByStatus(status);

    }






    @PutMapping("/{id}/approve")

    @PreAuthorize(
            "hasAnyRole('CHEF','SOUS_DIRECTEUR','DIRECTEUR','RH','ADMIN')"
    )

    public LeaveResponseDto approve(
            @PathVariable String id,
            @RequestBody UpdateLeaveStatusRequest request,
            Authentication authentication
    ){


        String role =
                authentication
                        .getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();



        return leaveRequestService
                .approveLeave(
                        id,
                        role,
                        request
                );

    }







    @PutMapping("/{id}/refuse")

    @PreAuthorize(
            "hasAnyRole('CHEF','SOUS_DIRECTEUR','DIRECTEUR','RH','ADMIN')"
    )

    public LeaveResponseDto refuse(
            @PathVariable String id,
            @RequestBody RefuseRequest request,
            Authentication authentication
    ){


        String role =
                authentication
                        .getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority();



        return leaveRequestService
                .refuseLeave(
                        id,
                        role,
                        request
                );

    }


}