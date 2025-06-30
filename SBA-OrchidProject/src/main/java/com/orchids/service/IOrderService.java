package com.orchids.service;

import com.orchids.dto.OrderRequestDTO;
import com.orchids.dto.OrderResponseDTO;

import java.util.List;

public interface IOrderService {

    public OrderResponseDTO createOrder(OrderRequestDTO order);
    public List<OrderResponseDTO> getOrdersByAccountId();

    public List<OrderResponseDTO> getOrdersAll();
}
