package tn.esprit.twin.backendstiirworkflow.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.service.UserService;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class UserControllerSalaryTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void salaryEndpointShouldUpdateUserSalary() throws Exception {
        User updatedUser = new User();
        updatedUser.setId("user-1");
        updatedUser.setSalaireMensuel(2500.0);

        when(userService.updateSalary("user-1", 2500.0)).thenReturn(updatedUser);

        mockMvc.perform(put("/api/users/user-1/salaire")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"salaireMensuel\":2500.0}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.salaireMensuel").value(2500.0));

        verify(userService).updateSalary("user-1", 2500.0);
    }
}
