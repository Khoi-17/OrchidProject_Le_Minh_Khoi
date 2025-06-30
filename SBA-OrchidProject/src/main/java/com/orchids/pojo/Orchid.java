package com.orchids.pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "orchids")
public class Orchid {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "is_natural", nullable = false)
    private boolean isNatural;

    @Column(name = "orchid_description", length = 500, nullable = false,columnDefinition = "NVARCHAR(MAX)")
    private String orchidDescription;

    @Column(name = "orchid_name", length = 100, nullable = false,columnDefinition = "NVARCHAR(100)")
    private String orchidName;

    @Column(name = "orchid_url", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String orchidUrl;

    @Column(name = "orchid_price", nullable = false)
    private double orchidPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public Orchid() {
    }

    public Orchid(int id, boolean isNatural, String orchidDescription, String orchidName, String orchidUrl, double orchidPrice, Category category) {
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

    public String getOrchidDescription() {
        return orchidDescription;
    }

    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }

    public boolean isNatural() {
        return isNatural;
    }

    public void setNatural(boolean natural) {
        isNatural = natural;
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

    public Category getCategory() {
        return category;
    }
    public void setCategory(Category category) {
        this.category = category;
    }

}
