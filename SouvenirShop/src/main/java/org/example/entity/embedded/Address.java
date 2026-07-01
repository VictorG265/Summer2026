package org.example.entity.embedded;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
public class Address implements Serializable {

    private String country;
    private String city;
    private String street;
    private String house;
    private String apartment;
    private String zipCode;
}
