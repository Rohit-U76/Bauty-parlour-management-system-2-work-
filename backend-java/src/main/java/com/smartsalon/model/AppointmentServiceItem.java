package com.smartsalon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "appointment_services")
public class AppointmentServiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "appointment_id", nullable = false)
    @JsonIgnore
    private Appointment appointment;

    @Column(name = "service_id", length = 64)
    private String serviceId;

    @Column(name = "service_name", nullable = false, length = 150)
    private String serviceName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 45;

    public AppointmentServiceItem() {}

    public AppointmentServiceItem(String serviceId, String serviceName, BigDecimal price, Integer durationMinutes) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.price = price != null ? price : BigDecimal.ZERO;
        this.durationMinutes = durationMinutes != null ? durationMinutes : 45;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
}
