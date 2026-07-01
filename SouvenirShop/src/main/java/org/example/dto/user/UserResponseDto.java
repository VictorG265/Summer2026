package org.example.dto.user;

import org.example.entity.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponseDto {

    private Long id;
    private String login;
    private String fio;
    private String email;
    private String phone;
    private UserRole role;
    private LocalDateTime createdAt;
}
