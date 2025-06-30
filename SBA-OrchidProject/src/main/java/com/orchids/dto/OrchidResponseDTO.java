package com.orchids.dto;

public class OrchidResponseDTO {

    private int id;
    private boolean isNatural;
    private String orchidDescription;
    private String orchidName;
    private String orchidUrl;
    private double orchidPrice;
    private CategoryDTO category;

    public OrchidResponseDTO() {
    }

    public OrchidResponseDTO(int id, boolean isNatural, String orchidDescription, String orchidName, String orchidUrl, double orchidPrice, CategoryDTO category) {
        this.id = id;
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidName = orchidName;
        this.orchidUrl = orchidUrl;
        this.orchidPrice = orchidPrice;
        this.category = category;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public CategoryDTO getCategory() {
        return category;
    }

    public void setCategory(CategoryDTO category) {
        this.category = category;
    }
}
