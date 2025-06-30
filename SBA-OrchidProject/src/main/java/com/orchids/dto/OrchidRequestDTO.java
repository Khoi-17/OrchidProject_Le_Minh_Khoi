package com.orchids.dto;

public class OrchidRequestDTO {
    private boolean isNatural;
    private String orchidDescription;
    private String orchidName;
    private String orchidUrl;
    private double orchidPrice;
    private int categoryId;

    public OrchidRequestDTO() {
    }

    public OrchidRequestDTO(boolean isNatural, String orchidDescription, String orchidName, String orchidUrl, double orchidPrice, int categoryId) {
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidName = orchidName;
        this.orchidUrl = orchidUrl;
        this.orchidPrice = orchidPrice;
        this.categoryId = categoryId;
    }


    public boolean isNatural() {
        return isNatural;
    }

    public void setNatural(boolean natural) {
        isNatural = natural;
    }

    public String getOrchidDescription() {
        return orchidDescription;
    }

    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }

    public String getOrchidName() {
        return orchidName;
    }

    public void setOrchidName(String orchidName) {
        this.orchidName = orchidName;
    }

    public String getOrchidUrl() {
        return orchidUrl;
    }

    public void setOrchidUrl(String orchidUrl) {
        this.orchidUrl = orchidUrl;
    }

    public double getOrchidPrice() {
        return orchidPrice;
    }

    public void setOrchidPrice(double orchidPrice) {
        this.orchidPrice = orchidPrice;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }
}
