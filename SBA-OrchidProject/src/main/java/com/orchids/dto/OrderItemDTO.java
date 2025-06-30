package com.orchids.dto;

public class OrderItemDTO {
    private int orchidId;
    private int quantity;
    private double price;

    public OrderItemDTO() {
    }
    public OrderItemDTO(int orchidId, int quantity, double price) {
        this.orchidId = orchidId;
        this.quantity = quantity;
        this.price = price;
    }
    public int getOrchidId() {
        return orchidId;
    }
    public void setOrchidId(int orchidId) {
        this.orchidId = orchidId;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
