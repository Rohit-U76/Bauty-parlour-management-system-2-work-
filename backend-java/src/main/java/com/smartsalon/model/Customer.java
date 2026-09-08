package com.smartsalon.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    private String id;

    private String name;
    private String phone;
    private String email;
    private int totalVisits;
    private double totalSpent;
    private String lastVisit;
    private String favoriteService;
    private String memberSince;
    private String tier; // 'Standard', 'VIP Member', 'New Client'

    public Customer() {}

    public Customer(String id, String name, String phone, String email, int totalVisits,
                    double totalSpent, String lastVisit, String favoriteService,
                    String memberSince, String tier) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.totalVisits = totalVisits;
        this.totalSpent = totalSpent;
        this.lastVisit = lastVisit;
        this.favoriteService = favoriteService;
        this.memberSince = memberSince;
        this.tier = tier;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getTotalVisits() { return totalVisits; }
    public void setTotalVisits(int totalVisits) { this.totalVisits = totalVisits; }

    public double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(double totalSpent) { this.totalSpent = totalSpent; }

    public String getLastVisit() { return lastVisit; }
    public void setLastVisit(String lastVisit) { this.lastVisit = lastVisit; }

    public String getFavoriteService() { return favoriteService; }
    public void setFavoriteService(String favoriteService) { this.favoriteService = favoriteService; }

    public String getMemberSince() { return memberSince; }
    public void setMemberSince(String memberSince) { this.memberSince = memberSince; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
}
