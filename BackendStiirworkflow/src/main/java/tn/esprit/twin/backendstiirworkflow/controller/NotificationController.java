package tn.esprit.twin.backendstiirworkflow.controller;

import lombok.RequiredArgsConstructor;
import tn.esprit.twin.backendstiirworkflow.entity.Notification;
import tn.esprit.twin.backendstiirworkflow.entity.User;
import tn.esprit.twin.backendstiirworkflow.repository.UserRepository;
import tn.esprit.twin.backendstiirworkflow.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping("/my")
    public List<Notification> getMyNotifications(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return notificationService.getMesNotifications(user.getId());
    }

    @GetMapping("/my/unread-count")
    public Map<String, Long> getUnreadCount(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return Map.of("count", notificationService.compterNonLues(user.getId()));
    }

    @PutMapping("/{id}/lue")
    public void marquerCommeLue(@PathVariable String id) {
        notificationService.marquerCommeLue(id);
    }
}