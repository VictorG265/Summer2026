package org.example.dto.product;

import org.example.entity.enums.ProductCategory;
import org.example.entity.enums.ProductCountry;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductRequestDto {

    @NotNull(message = "Категория не может быть пустой")
    private ProductCategory category;

    @NotNull(message = "Страна не может быть пустой")
    private ProductCountry country;

    @NotBlank(message = "Название не может быть пустым")
    @Size(max = 150, message = "Название не должно превышать 150 символов")
    private String name;

    private String description;

    @NotNull(message = "Цена не может быть пустой")
    @DecimalMin(value = "0.0", inclusive = false, message = "Цена должна быть больше нуля")
    private BigDecimal price;

    @NotNull(message = "Количество на складе не может быть пустым")
    @Min(value = 0, message = "Количество не может быть отрицательным")
    private Integer stock;

    private List<String> imagesUrl;
}