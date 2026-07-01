package org.example.service;

import org.example.dto.product.ProductRequestDto;
import org.example.dto.product.ProductResponseDto;
import org.example.entity.enums.ProductCategory;
import org.example.entity.enums.ProductCountry;
import java.util.List;

public interface ProductService {

    ProductResponseDto getById(Long id);

    List<ProductResponseDto> getAll();

    List<ProductResponseDto> getByCategory(ProductCategory category);

    List<ProductResponseDto> getByCountry(ProductCountry country);

    List<ProductResponseDto> getByCategoryAndCountry(ProductCategory category,
                                                     ProductCountry country);

    List<ProductResponseDto> searchByName(String name);

    ProductResponseDto create(ProductRequestDto dto);

    ProductResponseDto update(Long id, ProductRequestDto dto);

    void delete(Long id);
}
