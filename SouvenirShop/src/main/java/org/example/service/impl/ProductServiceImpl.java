package org.example.service.impl;

import org.example.dto.product.ProductMapper;
import org.example.dto.product.ProductRequestDto;
import org.example.dto.product.ProductResponseDto;
import org.example.entity.Product;
import org.example.entity.enums.ProductCategory;
import org.example.entity.enums.ProductCountry;
import org.example.exception.ResourceNotFoundException;
import org.example.repository.ProductRepository;
import org.example.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Товар с id " + id + " не найден"));
        return productMapper.toResponseDto(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAll() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getByCategory(ProductCategory category) {
        return productRepository.findByCategory(category)
                .stream()
                .map(productMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getByCountry(ProductCountry country) {
        return productRepository.findByCountry(country)
                .stream()
                .map(productMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getByCategoryAndCountry(ProductCategory category,
                                                            ProductCountry country) {
        return productRepository.findByCategoryAndCountry(category, country)
                .stream()
                .map(productMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(productMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public ProductResponseDto create(ProductRequestDto dto) {
        Product product = productMapper.toEntity(dto);
        return productMapper.toResponseDto(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponseDto update(Long id, ProductRequestDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Товар с id " + id + " не найден"));

        // Используем метод маппера для обновления существующего объекта
        productMapper.updateEntityFromDto(dto, product);

        return productMapper.toResponseDto(productRepository.save(product));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Товар с id " + id + " не найден");
        }
        productRepository.deleteById(id);
    }
}
