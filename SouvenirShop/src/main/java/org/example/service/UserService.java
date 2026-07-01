package org.example.service;

import org.example.dto.user.UserRequestDto;
import org.example.dto.user.UserResponseDto;
import java.util.List;

public interface UserService {

    UserResponseDto getById(Long id);

    List<UserResponseDto> getAll();

    UserResponseDto update(Long id, UserRequestDto dto);

    void delete(Long id);
}