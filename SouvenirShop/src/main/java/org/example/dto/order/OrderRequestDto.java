package org.example.dto.order;

import org.example.entity.embedded.Address;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequestDto {

    @NotNull(message = "ID товара не может быть пустым")
    private Long productId;

    @NotNull(message = "Количество не может быть пустым")
    @Min(value = 1, message = "Количество должно быть не менее 1")
    private Short quantity;

    @NotNull(message = "Адрес не может быть пустым")
    private Address address;
}
