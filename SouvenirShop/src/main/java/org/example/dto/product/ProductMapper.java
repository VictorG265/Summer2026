package org.example.dto.product;

import org.example.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ProductMapper {

    Product toEntity(ProductRequestDto dto);

    ProductResponseDto toResponseDto(Product product);

    // Для обновления — обновляет существующий объект, не создаёт новый
    void updateEntityFromDto(ProductRequestDto dto, @MappingTarget Product product);
}
