package tn.esprit.twin.backendstiirworkflow.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.model.SoldeConge;
import tn.esprit.twin.backendstiirworkflow.repository.SoldeCongeRepository;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;

import java.time.Year;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SoldeCongeServiceTest {

    @Mock
    private SoldeCongeRepository soldeCongeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SoldeCongeService soldeCongeService;

    @Test
    void getSoldeAnneeCourante_shouldResolveEmailToUserId() {
        User user = new User();
        user.setId("user-1");
        user.setEmail("employee@test.com");

        when(userRepository.findByEmail("employee@test.com")).thenReturn(Optional.of(user));
        when(soldeCongeRepository.findByUserIdAndAnnee("user-1", Year.now().getValue()))
                .thenReturn(Optional.of(new SoldeConge("user-1", Year.now().getValue(), 30)));

        SoldeConge solde = soldeCongeService.getSoldeAnneeCourante("employee@test.com");

        assertNotNull(solde);
        verify(soldeCongeRepository).findByUserIdAndAnnee("user-1", Year.now().getValue());
    }
}
