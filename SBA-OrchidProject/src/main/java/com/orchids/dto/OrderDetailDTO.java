package com.orchids.dto;

public class OrderDetailDTO {
    private int id;
    private double price;
    private int quantity;
    private int orchidId;
    private String orchidName;

    public OrderDetailDTO() {
    }
    public OrderDetailDTO(int id, double price, int quantity, int orchidId, String orchidName) {
        this.id = id;
        this.price = price;
        this.quantity = quantity;
        this.orchidId = orchidId;
        this.orchidName = orchidName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getOrchidId() {
        return orchidId;
    }

    public void setOrchidId(int orchidId) {
        this.orchidId = orchidId;
    }

    public String getOrchidName() {
        return orchidName;
    }

    public void setOrchidName(String orchidName) {
        this.orchidName = orchidName;
    }
}
