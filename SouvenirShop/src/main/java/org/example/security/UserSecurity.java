package org.example.security;

import org.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("userSecurity")
@RequiredArgsConstructor
public class UserSecurity {

    private final UserRepository userRepository;

    // Проверяем что авторизованный пользователь — владелец ресурса
    public boolean isOwner(Authentication authentication, Long userId) {
        String login = authentication.getName();
        return userRepository.findById(userId)
                .map(user -> user.getLogin().equals(login))
                .orElse(false);
    }
}
