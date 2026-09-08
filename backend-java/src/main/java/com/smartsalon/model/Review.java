package com.smartsalon.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    private String id;

    private String clientName;
    private double rating;
    private String serviceName;

    @Column(length = 1000)
    private String comment;

    private String date;
    private boolean verifiedBooking;
    private String avatarUrl;

    public Review() {}

    public Review(String id, String clientName, double rating, String serviceName,
                  String comment, String date, boolean verifiedBooking, String avatarUrl) {
        this.id = id;
        this.clientName = clientName;
        this.rating = rating;
        this.serviceName = serviceName;
        this.comment = comment;
        this.date = date;
        this.verifiedBooking = verifiedBooking;
        this.avatarUrl = avatarUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public boolean isVerifiedBooking() { return verifiedBooking; }
    public void setVerifiedBooking(boolean verifiedBooking) { this.verifiedBooking = verifiedBooking; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
