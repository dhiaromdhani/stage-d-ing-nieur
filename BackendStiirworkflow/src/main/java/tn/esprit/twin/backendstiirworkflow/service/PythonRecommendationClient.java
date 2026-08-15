package tn.esprit.twin.backendstiirworkflow.service;

import tn.esprit.twin.backendstiirworkflow.dto.AnalyseIAResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
public class PythonRecommendationClient {

    private final WebClient webClient;

    public PythonRecommendationClient(@Value("${python.api.url}") String pythonApiUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(pythonApiUrl)
                .build();
    }

    public AnalyseIAResult analyser(String prompt, List<Map<String, Object>> employees) {
        try {
            Map<String, Object> body = Map.of(
                    "prompt", prompt,
                    "employees", employees
            );
            return webClient.post()
                    .uri("/analyze")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(AnalyseIAResult.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();
        } catch (Exception e) {
            System.err.println("Erreur appel service Python (/analyze) : " + e.getMessage());
            return null;
        }
    }
}