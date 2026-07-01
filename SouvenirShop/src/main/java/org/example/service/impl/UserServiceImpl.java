package org.example.service.impl;

import org.example.dto.user.UserMapper;
import org.example.dto.user.UserRequestDto;
import org.example.dto.user.UserResponseDto;
import org.example.entity.User;
import org.example.exception.AlreadyExistsException;
import org.example.exception.ResourceNotFoundException;
import org.example.repository.UserRepository;
import org.example.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Пользователь с id " + id + " не найден"));
        return userMapper.toResponseDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public UserResponseDto update(Long id, UserRequestDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Пользователь с id " + id + " не найден"));

        // Проверяем уникальность логина если он изменился
        if (!user.getLogin().equals(dto.getLogin()) &&
                userRepository.existsByLogin(dto.getLogin())) {
            throw new AlreadyExistsException(
                    "Пользователь с логином " + dto.getLogin() + " уже существует");
        }

        // Проверяем уникальность email если он изменился
        if (!user.getEmail().equals(dto.getEmail()) &&
                userRepository.existsByEmail(dto.getEmail())) {
            throw new AlreadyExistsException(
                    "Пользователь с email " + dto.getEmail() + " уже существует");
        }

        user.setLogin(dto.getLogin());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFio(dto.getFio());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        return userMapper.toResponseDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Пользователь с id " + id + " не найден");
        }
        userRepository.deleteById(id);
    }
}