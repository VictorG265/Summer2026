package org.example.controller;

import org.example.dto.order.OrderRequestDto;
import org.example.dto.order.OrderResponseDto;
import org.example.entity.enums.OrderStatus;
import org.example.repository.UserRepository;
import org.example.exception.ResourceNotFoundException;
import org.example.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(AbstractController.API_PREFIX + "/orders")
@RequiredArgsConstructor
public class OrderController extends AbstractController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    // Получить все заказы — только ADMIN
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDto>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    // Получить заказ по id — только ADMIN
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    // Получить заказы по статусу — только ADMIN
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDto>> getByStatus(
            @PathVariable OrderStatus status) {
        return ResponseEntity.ok(orderService.getByStatus(status));
    }

    // Получить свои заказы — авторизованный пользователь
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponseDto>> getMyOrders(
            Authentication authentication) {

        // Получаем id текущего пользователя из токена
        String login = authentication.getName();
        Long userId = userRepository.findByLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Пользователь не найден"))
                .getId();

        return ResponseEntity.ok(orderService.getByUserId(userId));
    }

    // Создать заказ — авторизованный пользователь
    @PostMapping
    public ResponseEntity<OrderResponseDto> create(
            Authentication authentication,
            @Valid @RequestBody OrderRequestDto dto) {

        String login = authentication.getName();
        Long userId = userRepository.findByLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Пользователь не найден"))
                .getId();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(orderService.create(userId, dto));
    }

    // Обновить статус заказа — только ADMIN
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateStatus(id, status));
    }

    // Удалить заказ — только ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
