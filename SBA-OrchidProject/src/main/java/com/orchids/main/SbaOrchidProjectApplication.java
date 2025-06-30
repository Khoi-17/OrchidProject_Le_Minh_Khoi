package com.orchids.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@EntityScan(basePackages = "com.orchids.pojo")
@ComponentScan(basePackages = "com.orchids.controller, com.orchids.service, com.orchids.config")
@EnableJpaRepositories(basePackages = "com.orchids.repository")
public class SbaOrchidProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(SbaOrchidProjectApplication.class, args);
    }

}
