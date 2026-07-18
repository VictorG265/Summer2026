package org.example.controller;

import org.example.dto.user.UserRequestDto;
import org.example.dto.user.UserResponseDto;
import org.example.entity.User;
import org.example.exception.ResourceNotFoundException;
import org.example.repository.UserRepository;
import org.example.dto.user.UserMapper;
import org.example.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(AbstractController.API_PREFIX + "/users")
@RequiredArgsConstructor
public class UserController extends AbstractController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // Получить свой профиль — любой авторизованный пользователь
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMe(Authentication authentication) {
        String login = authentication.getName();
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Пользователь не найден"));
        return ResponseEntity.ok(userMapper.toResponseDto(user));
    }

    // Получить всех пользователей — только ADMIN
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    // Получить пользователя по id — только ADMIN
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    // Обновить пользователя — ADMIN или сам пользователь
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isOwner(authentication, #id)")
    public ResponseEntity<UserResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDto dto) {
        return ResponseEntity.ok(userService.update(id, dto));
    }

    // Удалить пользователя — только ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}