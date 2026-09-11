package com.smartsalon.controller;

import com.smartsalon.dto.ApiResponse;
import com.smartsalon.dto.AppointmentRequestDTO;
import com.smartsalon.dto.SlotAvailabilityDTO;
import com.smartsalon.model.Appointment;
import com.smartsalon.model.BookingStatus;
import com.smartsalon.model.PaymentStatus;
import com.smartsalon.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/slots")
    public ResponseEntity<List<SlotAvailabilityDTO>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(date));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Appointment>> getMyAppointments(@RequestParam String phone) {
        return ResponseEntity.ok(appointmentService.getCustomerAppointments(phone));
    }

    @GetMapping("/ref/{bookingRef}")
    public ResponseEntity<Appointment> getAppointmentByRef(@PathVariable String bookingRef) {
        return appointmentService.getAppointmentByBookingRef(bookingRef)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(appointmentService.getDashboardStats());
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(appointmentService.getAppointments(date, status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@Valid @RequestBody AppointmentRequestDTO request) {
        Appointment created = appointmentService.createAppointment(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        BookingStatus status = parseBookingStatus(body.get("status"));
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @PatchMapping({"/{id}/payment", "/{id}/payment-status"})
    public ResponseEntity<Appointment> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String raw = body.get("paymentStatus") != null ? body.get("paymentStatus") : body.get("status");
        PaymentStatus status = parsePaymentStatus(raw);
        String paymentId = body.get("paymentId") != null ? body.get("paymentId") : body.get("payment_id");
        return ResponseEntity.ok(appointmentService.updatePaymentStatus(id, status, paymentId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAppointment(@PathVariable Long id) {
        boolean deleted = appointmentService.deleteAppointment(id);
        if (deleted) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Appointment deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, "Appointment not found"));
    }

    private BookingStatus parseBookingStatus(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("status is required");
        }
        String normalized = raw.trim().toUpperCase();
        if ("REJECTED".equals(normalized) || "REJECT".equals(normalized)) {
            return BookingStatus.CANCELLED;
        }
        if ("DONE".equals(normalized)) {
            return BookingStatus.COMPLETED;
        }
        if ("CONFIRM".equals(normalized) || "ACCEPT".equals(normalized)) {
            return BookingStatus.CONFIRMED;
        }
        try {
            return BookingStatus.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unknown booking status: " + raw);
        }
    }

    private PaymentStatus parsePaymentStatus(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("paymentStatus is required");
        }
        try {
            return PaymentStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unknown payment status: " + raw);
        }
    }
}
