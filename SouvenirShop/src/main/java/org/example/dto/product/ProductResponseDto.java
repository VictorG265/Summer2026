package org.example.dto.product;

import org.example.entity.enums.ProductCategory;
import org.example.entity.enums.ProductCountry;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ProductResponseDto {

    private Long id;
    private ProductCategory category;
    private ProductCountry country;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private List<String> imagesUrl;
}
