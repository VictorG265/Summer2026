package org.example.dto.user;

import org.example.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    // RequestDto → Entity
    User toEntity(UserRequestDto dto);

    // Entity → ResponseDto
    UserResponseDto toResponseDto(User user);
}
