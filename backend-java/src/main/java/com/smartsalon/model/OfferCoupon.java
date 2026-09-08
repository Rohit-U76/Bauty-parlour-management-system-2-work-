package com.smartsalon.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "offers")
public class OfferCoupon {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String code;

    private String title;
    private Integer discountPercent;
    private Double discountAmount;
    private double minBookingAmount;
    private String validTill;

    @Column(length = 500)
    private String description;

    private boolean active;

    public OfferCoupon() {}

    public OfferCoupon(String id, String code, String title, Integer discountPercent,
                       Double discountAmount, double minBookingAmount, String validTill,
                       String description, boolean active) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.discountPercent = discountPercent;
        this.discountAmount = discountAmount;
        this.minBookingAmount = minBookingAmount;
        this.validTill = validTill;
        this.description = description;
        this.active = active;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }

    public double getMinBookingAmount() { return minBookingAmount; }
    public void setMinBookingAmount(double minBookingAmount) { this.minBookingAmount = minBookingAmount; }

    public String getValidTill() { return validTill; }
    public void setValidTill(String validTill) { this.validTill = validTill; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
