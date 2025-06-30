package com.orchids.repository;

import com.orchids.dto.OrderResponseDTO;
import com.orchids.pojo.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByAccountId(int accountId);
}
