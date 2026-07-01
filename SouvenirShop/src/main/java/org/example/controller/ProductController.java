package org.example.controller;

import org.example.dto.product.ProductRequestDto;
import org.example.dto.product.ProductResponseDto;
import org.example.entity.enums.ProductCategory;
import org.example.entity.enums.ProductCountry;
import org.example.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(AbstractController.API_PREFIX + "/products")
@RequiredArgsConstructor
public class ProductController extends AbstractController {

    private final ProductService productService;

    // Получить все товары — публичный
    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    // Получить товар по id — публичный
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    // Поиск по названию — публичный
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDto>> searchByName(
            @RequestParam String name) {
        return ResponseEntity.ok(productService.searchByName(name));
    }

    // Фильтр по категории — публичный
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponseDto>> getByCategory(
            @PathVariable ProductCategory category) {
        return ResponseEntity.ok(productService.getByCategory(category));
    }

    // Фильтр по стране — публичный
    @GetMapping("/country/{country}")
    public ResponseEntity<List<ProductResponseDto>> getByCountry(
            @PathVariable ProductCountry country) {
        return ResponseEntity.ok(productService.getByCountry(country));
    }

    // Фильтр по категории и стране — публичный
    @GetMapping("/filter")
    public ResponseEntity<List<ProductResponseDto>> getByCategoryAndCountry(
            @RequestParam ProductCategory category,
            @RequestParam ProductCountry country) {
        return ResponseEntity.ok(productService.getByCategoryAndCountry(category, country));
    }

    // Создать товар — только ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDto> create(
            @Valid @RequestBody ProductRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(dto));
    }

    // Обновить товар — только ADMIN
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDto dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    // Удалить товар — только ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
