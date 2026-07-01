package org.example.controller;

import org.example.dto.auth.LoginRequestDto;
import org.example.dto.auth.LoginResponseDto;
import org.example.dto.user.UserRequestDto;
import org.example.dto.user.UserResponseDto;
import org.example.entity.User;
import org.example.entity.enums.UserRole;
import org.example.exception.AlreadyExistsException;
import org.example.repository.UserRepository;
import org.example.security.JwtUtil;
import org.example.dto.user.UserMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AbstractController.API_PREFIX + "/auth")
@RequiredArgsConstructor
public class AuthController extends AbstractController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    // Регистрация
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(
            @Valid @RequestBody UserRequestDto dto) {

        if (userRepository.existsByLogin(dto.getLogin())) {
            throw new AlreadyExistsException(
                    "Пользователь с логином " + dto.getLogin() + " уже существует");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new AlreadyExistsException(
                    "Пользователь с email " + dto.getEmail() + " уже существует");
        }

        User user = userMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(UserRole.USER);

        User saved = userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toResponseDto(saved));
    }

    // Вход
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto dto) {

        // Spring Security сам проверит логин и пароль
        // Если неверные — бросит BadCredentialsException
        // который поймает наш GlobalExceptionHandler
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getLogin(), dto.getPassword())
        );

        User user = userRepository.findByLogin(dto.getLogin())
                .orElseThrow(() -> new BadCredentialsException("Неверный логин или пароль"));

        String token = jwtUtil.generateToken(
                user.getLogin(),
                user.getRole().name()
        );

        return ResponseEntity.ok(new LoginResponseDto(token, user.getRole().name()));
    }
}
