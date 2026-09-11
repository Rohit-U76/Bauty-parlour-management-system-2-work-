package com.smartsalon.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "appointments",
        uniqueConstraints = {
                @UniqueConstraint(name = "idx_appointments_booking_ref", columnNames = "booking_ref")
        }
)
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_ref", nullable = false, unique = true, length = 32)
    private String bookingRef;

    @Column(name = "user_id", length = 64)
    private String userId;

    @Column(name = "client_name", nullable = false, length = 120)
    private String clientName;

    @Column(name = "client_phone", nullable = false, length = 20)
    private String clientPhone;

    @Column(name = "client_email", length = 191)
    private String clientEmail;

    @Column(length = 100)
    private String category;

    @Column(name = "appointment_date", nullable = false)
    @JsonProperty("date")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appointmentDate;

    @Column(name = "time_slot", nullable = false, length = 30)
    private String timeSlot;

    @Column(name = "stylist_id", length = 64)
    private String stylistId;

    @Column(name = "stylist_name", nullable = false, length = 120)
    private String stylistName = "Any Available Expert";

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "advance_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal advancePaid = BigDecimal.ZERO;

    @Column(name = "balance_due", nullable = false, precision = 10, scale = 2)
    private BigDecimal balanceDue = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false, length = 20)
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_id", length = 100)
    private String paymentId;

    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<AppointmentServiceItem> services = new ArrayList<>();

    public Appointment() {}

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.stylistName == null || this.stylistName.isBlank()) {
            this.stylistName = "Any Available Expert";
        }
        recalculateBalance();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        recalculateBalance();
    }

    public void recalculateBalance() {
        BigDecimal total = totalAmount != null ? totalAmount : BigDecimal.ZERO;
        BigDecimal advance = advancePaid != null ? advancePaid : BigDecimal.ZERO;
        this.balanceDue = total.subtract(advance);
    }

    public void addService(AppointmentServiceItem item) {
        item.setAppointment(this);
        this.services.add(item);
    }

    /** Frontend compatibility: first line-item name. */
    @JsonProperty("serviceName")
    public String getServiceName() {
        if (services == null || services.isEmpty()) return null;
        return services.get(0).getServiceName();
    }

    @JsonProperty("serviceId")
    public String getServiceId() {
        if (services == null || services.isEmpty()) return null;
        return services.get(0).getServiceId();
    }

    /** Frontend compatibility: some views still read `status`. */
    @JsonProperty("status")
    public BookingStatus getStatus() {
        return bookingStatus;
    }

    @JsonProperty("razorpayPaymentId")
    public String getRazorpayPaymentId() {
        return paymentId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String clientPhone) { this.clientPhone = clientPhone; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getStylistId() { return stylistId; }
    public void setStylistId(String stylistId) { this.stylistId = stylistId; }

    public String getStylistName() { return stylistName; }
    public void setStylistName(String stylistName) { this.stylistName = stylistName; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getAdvancePaid() { return advancePaid; }
    public void setAdvancePaid(BigDecimal advancePaid) { this.advancePaid = advancePaid; }

    public BigDecimal getBalanceDue() { return balanceDue; }
    public void setBalanceDue(BigDecimal balanceDue) { this.balanceDue = balanceDue; }

    public BookingStatus getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<AppointmentServiceItem> getServices() { return services; }
    public void setServices(List<AppointmentServiceItem> services) {
        this.services = services != null ? services : new ArrayList<>();
        for (AppointmentServiceItem item : this.services) {
            item.setAppointment(this);
        }
    }
}
