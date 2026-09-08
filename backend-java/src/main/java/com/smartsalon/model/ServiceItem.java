package com.smartsalon.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "services")
public class ServiceItem {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String gender; // 'women', 'men', 'unisex'

    private int durationMinutes;

    @Column(nullable = false)
    private double price;

    private double advanceDeposit; // 10%

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String imageUrl;

    private boolean popular;

    private double rating;

    private int reviewsCount;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "service_benefits", joinColumns = @JoinColumn(name = "service_id"))
    @Column(name = "benefit")
    private List<String> benefits = new ArrayList<>();

    public ServiceItem() {}

    public ServiceItem(String id, String name, String category, String gender, int durationMinutes,
                       double price, double advanceDeposit, String description, String imageUrl,
                       boolean popular, double rating, int reviewsCount, List<String> benefits) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.gender = gender;
        this.durationMinutes = durationMinutes;
        this.price = price;
        this.advanceDeposit = advanceDeposit;
        this.description = description;
        this.imageUrl = imageUrl;
        this.popular = popular;
        this.rating = rating;
        this.reviewsCount = reviewsCount;
        this.benefits = benefits != null ? benefits : new ArrayList<>();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public double getPrice() { return price; }
    public void setPrice(double price) {
        this.price = price;
        this.advanceDeposit = Math.round((price * 10) / 100.0);
    }

    public double getAdvanceDeposit() { return advanceDeposit; }
    public void setAdvanceDeposit(double advanceDeposit) { this.advanceDeposit = advanceDeposit; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isPopular() { return popular; }
    public void setPopular(boolean popular) { this.popular = popular; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(int reviewsCount) { this.reviewsCount = reviewsCount; }

    public List<String> getBenefits() { return benefits; }
    public void setBenefits(List<String> benefits) { this.benefits = benefits; }
}
