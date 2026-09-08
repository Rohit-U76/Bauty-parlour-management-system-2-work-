package com.smartsalon.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "inquiries")
public class ContactInquiry {

    @Id
    private String id;

    @Column(nullable = false)
    private String clientName;

    @Column(nullable = false)
    private String phone;

    private String email;
    private String subject;
    private String serviceCategory;

    @Column(length = 2000, nullable = false)
    private String message;

    private String status; // 'NEW', 'IN PROGRESS', 'RESOLVED'
    private String receivedDate;

    @Column(length = 2000)
    private String ownerReply;

    public ContactInquiry() {}

    public ContactInquiry(String id, String clientName, String phone, String email,
                          String subject, String serviceCategory, String message,
                          String status, String receivedDate, String ownerReply) {
        this.id = id;
        this.clientName = clientName;
        this.phone = phone;
        this.email = email;
        this.subject = subject;
        this.serviceCategory = serviceCategory;
        this.message = message;
        this.status = status;
        this.receivedDate = receivedDate;
        this.ownerReply = ownerReply;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getServiceCategory() { return serviceCategory; }
    public void setServiceCategory(String serviceCategory) { this.serviceCategory = serviceCategory; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReceivedDate() { return receivedDate; }
    public void setReceivedDate(String receivedDate) { this.receivedDate = receivedDate; }

    public String getOwnerReply() { return ownerReply; }
    public void setOwnerReply(String ownerReply) { this.ownerReply = ownerReply; }
}
