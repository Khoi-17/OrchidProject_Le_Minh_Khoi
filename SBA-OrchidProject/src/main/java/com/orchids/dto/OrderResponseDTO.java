package com.orchids.dto;

import java.sql.Timestamp;
import java.util.List;

public class OrderResponseDTO {

    private int orderId;
    private Timestamp orderDate;
    private String customerName;
    private String status;
    private double totalAmount;
    private List<OrderDetailDTO> orderDetails;


    public OrderResponseDTO() {
    }

    public OrderResponseDTO(int orderId, Timestamp orderDate, String customerName, String status, double totalAmount, List<OrderDetailDTO> orderDetails) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.customerName = customerName;
        this.status = status;
        this.totalAmount = totalAmount;
        this.orderDetails = orderDetails;
    }

    public List<OrderDetailDTO> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetailDTO> orderDetails) {
        this.orderDetails = orderDetails;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public Timestamp getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Timestamp orderDate) {
        this.orderDate = orderDate;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

}
