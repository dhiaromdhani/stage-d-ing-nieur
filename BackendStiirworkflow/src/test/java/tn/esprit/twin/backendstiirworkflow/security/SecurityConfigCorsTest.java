package tn.esprit.twin.backendstiirworkflow.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigCorsTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void preflightRequestFromViteShouldBeAccepted() throws Exception {
        mockMvc.perform(options("/api/leaves/create")
                        .header("Origin", "http://127.0.0.1:5173")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "authorization,content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", containsString("127.0.0.1")));
    }

    @Test
    void leaveCreationEndpointRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/leaves/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"startDate\":\"2026-07-20\",\"endDate\":\"2026-07-25\",\"reason\":\"Congé\"}"))
                .andExpect(status().isUnauthorized());
    }
}
