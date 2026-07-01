package org.example.service;

import org.example.dto.order.OrderRequestDto;
import org.example.dto.order.OrderResponseDto;
import org.example.entity.enums.OrderStatus;
import java.util.List;

public interface OrderService {

    OrderResponseDto getById(Long id);

    List<OrderResponseDto> getAll();

    List<OrderResponseDto> getByUserId(Long userId);

    List<OrderResponseDto> getByStatus(OrderStatus status);

    OrderResponseDto create(Long userId, OrderRequestDto dto);

    OrderResponseDto updateStatus(Long id, OrderStatus status);

    void delete(Long id);
}
