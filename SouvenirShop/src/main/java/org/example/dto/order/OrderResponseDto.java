package org.example.dto.order;

import org.example.entity.embedded.Address;
import org.example.entity.enums.OrderStatus;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class OrderResponseDto {

    private Long id;
    private Long userId;
    private Long productId;
    private String productName;
    private Short quantity;
    private BigDecimal priceSnapshot;
    private OrderStatus status;
    private Address address;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdate;
}