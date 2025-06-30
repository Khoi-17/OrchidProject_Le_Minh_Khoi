package com.orchids.dto;

import java.util.List;

public class OrderRequestDTO {

    private List<OrderItemDTO> orderItems;


    public OrderRequestDTO() {
    }

    public OrderRequestDTO(List<OrderItemDTO> orderItems) {
        this.orderItems = orderItems;
    }

    public List<OrderItemDTO> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemDTO> orderItems) {
        this.orderItems = orderItems;
    }

}
