package com.smartsalon.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartsalon.model.BookingStatus;
import com.smartsalon.model.PaymentStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AppointmentRequestDTO {

    private String userId;

    @NotBlank(message = "Client name is required")
    private String clientName;

    @NotBlank(message = "Client phone is required")
    @Pattern(regexp = "^[+0-9\\s\\-]{10,20}$", message = "Enter a valid mobile number (10–20 digits)")
    private String clientPhone;

    @Pattern(regexp = "^$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Enter a valid email address")
    private String clientEmail;

    private String serviceId;
    private String serviceName;
    private String category;
    private Integer durationMinutes;

    @NotNull(message = "Appointment date is required")
    @JsonProperty("date")
    @JsonAlias({"appointmentDate", "date"})
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate appointmentDate;

    @NotBlank(message = "Time slot is required")
    private String timeSlot;

    private String stylistId;
    private String stylistName;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;

    private BigDecimal advancePaid;

    private String paymentId;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String notes;

    private BookingStatus bookingStatus;
    private PaymentStatus paymentStatus;

    @Valid
    private List<AppointmentServiceLineDTO> services = new ArrayList<>();

    public AppointmentRequestDTO() {}

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

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

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    @JsonProperty("date")
    public LocalDate getDate() { return appointmentDate; }
    public void setDate(LocalDate date) { this.appointmentDate = date; }

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

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public BookingStatus getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public List<AppointmentServiceLineDTO> getServices() { return services; }
    public void setServices(List<AppointmentServiceLineDTO> services) { this.services = services; }
}
