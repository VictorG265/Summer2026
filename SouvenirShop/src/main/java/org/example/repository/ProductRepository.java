package org.example.repository;

import org.example.entity.Product;
import org.example.entity.enums.ProductCategory;
import org.example.entity.enums.ProductCountry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(ProductCategory category);

    List<Product> findByCountry(ProductCountry country);

    List<Product> findByCategoryAndCountry(ProductCategory category, ProductCountry country);

    List<Product> findByNameContainingIgnoreCase(String name);
}
