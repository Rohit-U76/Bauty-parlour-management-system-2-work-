package com.smartsalon.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String bookingRef;

    @Column(nullable = false)
    private String clientName;

    @Column(nullable = false)
    private String clientPhone;

    private String clientEmail;

    @Column(nullable = false)
    private String serviceId;

    @Column(nullable = false)
    private String serviceName;

    private String category;

    @Column(nullable = false)
    private String date; // YYYY-MM-DD

    @Column(nullable = false)
    private String timeSlot; // e.g. "10:30 AM"

    private String stylistName;

    @Column(nullable = false)
    private double totalAmount;

    @Column(nullable = false)
    private double advancePaid; // 10% deposit

    @Column(nullable = false)
    private double balanceDue; // 90% remaining

    @Column(nullable = false)
    private String paymentStatus; // 'PAID', 'PENDING', 'REFUNDED'

    @Column(nullable = false)
    private String bookingStatus; // 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'

    private String razorpayPaymentId;

    private String razorpayOrderId;

    @Column(nullable = false)
    private String createdAt;

    @Column(length = 1000)
    private String notes;

    public Appointment() {}

    public Appointment(String id, String bookingRef, String clientName, String clientPhone,
                       String clientEmail, String serviceId, String serviceName, String category,
                       String date, String timeSlot, String stylistName, double totalAmount,
                       double advancePaid, double balanceDue, String paymentStatus,
                       String bookingStatus, String razorpayPaymentId, String razorpayOrderId,
                       String createdAt, String notes) {
        this.id = id;
        this.bookingRef = bookingRef;
        this.clientName = clientName;
        this.clientPhone = clientPhone;
        this.clientEmail = clientEmail;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.category = category;
        this.date = date;
        this.timeSlot = timeSlot;
        this.stylistName = stylistName;
        this.totalAmount = totalAmount;
        this.advancePaid = advancePaid;
        this.balanceDue = balanceDue;
        this.paymentStatus = paymentStatus;
        this.bookingStatus = bookingStatus;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpayOrderId = razorpayOrderId;
        this.createdAt = createdAt;
        this.notes = notes;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getStylistName() { return stylistName; }
    public void setStylistName(String stylistName) { this.stylistName = stylistName; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public double getAdvancePaid() { return advancePaid; }
    public void setAdvancePaid(double advancePaid) { this.advancePaid = advancePaid; }

    public double getBalanceDue() { return balanceDue; }
    public void setBalanceDue(double balanceDue) { this.balanceDue = balanceDue; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
