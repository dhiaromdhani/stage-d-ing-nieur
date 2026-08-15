package tn.esprit.twin.backendstiirworkflow.service;


import lombok.RequiredArgsConstructor;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class LeaveNotificationService {



    private final JavaMailSender mailSender;




    /*
     * Envoyer une notification email
     */
    public void sendEmail(
            String receiver,
            String subject,
            String message
    ){


        SimpleMailMessage mail =
                new SimpleMailMessage();


        mail.setTo(receiver);


        mail.setSubject(subject);


        mail.setText(message);



        try {

            mailSender.send(mail);

            System.out.println(
                    "Email envoyé avec succès"
            );


        }
        catch(Exception e){

            System.out.println(
                    "Erreur envoi email : "
                            + e.getMessage()
            );

        }

    }






    /*
     * Notification au Chef
     * après création demande
     */
    public void notifyChef(
            String employeeName
    ){


        sendEmail(

                "chef@stir.tn",

                "Nouvelle demande de congé",

                "Une nouvelle demande de congé a été créée par : "
                        + employeeName
                        +
                        "\nVeuillez consulter votre espace de validation."

        );


    }






    /*
     * Notification au Sous Directeur
     */
    public void notifySousDirecteur(
            String employeeName
    ){


        sendEmail(

                "sousdirecteur@stir.tn",

                "Demande de congé à valider",

                "La demande de congé de "
                        + employeeName
                        +
                        " a été validée par le Chef."
        );


    }






    /*
     * Notification au Directeur
     */
    public void notifyDirecteur(
            String employeeName
    ){


        sendEmail(

                "directeur@stir.tn",

                "Validation congé nécessaire",

                "Une demande de congé attend votre validation."
        );


    }







    /*
     * Notification au RH
     */
    public void notifyRH(
            String employeeName
    ){


        sendEmail(

                "rh@stir.tn",

                "Dernière validation congé",

                "La demande de congé de "
                        + employeeName
                        +
                        " attend votre validation finale."

        );


    }







    /*
     * Notification refus
     */
    public void notifyRefusal(
            String employeeEmail,
            String comment
    ){



        sendEmail(

                employeeEmail,

                "Demande de congé refusée",

                "Votre demande de congé a été refusée.\n\n"
                        +
                        "Motif : "
                        +
                        comment

        );


    }


}