package com.supermarket.controller;

import com.supermarket.model.Role;
import com.supermarket.model.User;
import com.supermarket.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public AdminController(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @GetMapping("/customers")
    public List<User> customers() {
        return userRepository.findByRole(Role.CUSTOMER);
    }

    @GetMapping("/sellers")
    public List<User> sellers() {
        return userRepository.findByRole(Role.SELLER);
    }

    @GetMapping("/admins")
    public List<User> admins() {
        return userRepository.findByRole(Role.ADMIN);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if (user.getRole() == Role.ADMIN) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("message", "Use the admin list carefully. Admin deletion is disabled in this demo."));
                    }
                    userRepository.delete(user);
                    return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/admins")
    public ResponseEntity<?> addAdmin(@RequestBody AdminRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already exists"));
        }

        User admin = new User(
                request.name(),
                request.email(),
                encoder.encode(request.password()),
                Role.ADMIN
        );

        return ResponseEntity.ok(userRepository.save(admin));
    }

    public record AdminRequest(String name, String email, String password) {}
}
