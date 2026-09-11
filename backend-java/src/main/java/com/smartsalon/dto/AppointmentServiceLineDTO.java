package com.smartsalon.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public class AppointmentServiceLineDTO {

    private String serviceId;

    @NotBlank(message = "Service name is required")
    private String serviceName;

    private BigDecimal price;

    private Integer durationMinutes;

    public AppointmentServiceLineDTO() {}

    public String getServiceId() { return serviceId; }
    public void setServiceId(String serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
}
