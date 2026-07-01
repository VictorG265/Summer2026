package org.example.service.impl;

import org.example.dto.order.OrderMapper;
import org.example.dto.order.OrderRequestDto;
import org.example.dto.order.OrderResponseDto;
import org.example.entity.Order;
import org.example.entity.Product;
import org.example.entity.User;
import org.example.entity.enums.OrderStatus;
import org.example.exception.InsufficientStockException;
import org.example.exception.ResourceNotFoundException;
import org.example.repository.OrderRepository;
import org.example.repository.ProductRepository;
import org.example.repository.UserRepository;
import org.example.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Заказ с id " + id + " не найден"));
        return orderMapper.toResponseDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAll() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getByUserId(Long userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status)
                .stream()
                .map(orderMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponseDto create(Long userId, OrderRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Пользователь с id " + userId + " не найден"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Товар с id " + dto.getProductId() + " не найден"));

        // Проверяем остаток на складе
        if (product.getStock() < dto.getQuantity()) {
            throw new InsufficientStockException(
                    "Недостаточно товара на складе. Доступно: " + product.getStock());
        }

        // Списываем товар со склада
        product.setStock(product.getStock() - dto.getQuantity());
        productRepository.save(product);

        // Создаём заказ
        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(dto.getQuantity());
        order.setPriceSnapshot(product.getPrice()); // фиксируем цену
        order.setStatus(OrderStatus.PENDING);
        order.setAddress(dto.getAddress());

        return orderMapper.toResponseDto(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponseDto updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Заказ с id " + id + " не найден"));

        // Если заказ отменяется — возвращаем товар на склад
        if (status == OrderStatus.CANCELLED &&
                order.getStatus() != OrderStatus.CANCELLED) {
            Product product = order.getProduct();
            product.setStock(product.getStock() + order.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(status);
        return orderMapper.toResponseDto(orderRepository.save(order));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Заказ с id " + id + " не найден");
        }
        orderRepository.deleteById(id);
    }
}
