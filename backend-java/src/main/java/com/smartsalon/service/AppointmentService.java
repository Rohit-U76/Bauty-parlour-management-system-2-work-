package com.smartsalon.service;

import com.smartsalon.dto.AppointmentRequest;
import com.smartsalon.model.Appointment;
import com.smartsalon.model.Customer;
import com.smartsalon.repository.AppointmentRepository;
import com.smartsalon.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(String id) {
        return appointmentRepository.findById(id);
    }

    public Optional<Appointment> getAppointmentByBookingRef(String bookingRef) {
        return appointmentRepository.findByBookingRef(bookingRef);
    }

    public Appointment createAppointment(AppointmentRequest request) {
        String id = "apt_" + System.currentTimeMillis();
        String bookingRef = "SS-" + LocalDateTime.now().getYear() + "-" + (100000 + (int)(Math.random() * 900000));
        
        double total = request.getTotalAmount();
        double advance = request.getAdvancePaid() > 0 ? request.getAdvancePaid() : Math.round((total * 10) / 100.0);
        double balance = total - advance;

        Appointment appointment = new Appointment(
                id,
                bookingRef,
                request.getClientName(),
                request.getClientPhone(),
                request.getClientEmail(),
                request.getServiceId(),
                request.getServiceName(),
                request.getCategory(),
                request.getDate(),
                request.getTimeSlot(),
                request.getStylistName() != null ? request.getStylistName() : "Any Available Stylist",
                total,
                advance,
                balance,
                "PAID",
                "CONFIRMED",
                request.getRazorpayPaymentId(),
                request.getRazorpayOrderId(),
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                request.getNotes()
        );

        Appointment saved = appointmentRepository.save(appointment);

        // Update or create customer CRM record
        syncCustomerRecord(request.getClientName(), request.getClientPhone(), request.getClientEmail(), request.getServiceName(), total);

        return saved;
    }

    public Optional<Appointment> updateStatus(String id, String status) {
        return appointmentRepository.findById(id).map(apt -> {
            apt.setBookingStatus(status);
            return appointmentRepository.save(apt);
        });
    }

    public Optional<Appointment> updatePaymentStatus(String id, String paymentStatus) {
        return appointmentRepository.findById(id).map(apt -> {
            apt.setPaymentStatus(paymentStatus);
            return appointmentRepository.save(apt);
        });
    }

    public boolean deleteAppointment(String id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Map<String, Object> getDashboardStats() {
        List<Appointment> all = appointmentRepository.findAll();
        double totalRevenue = all.stream().mapToDouble(Appointment::getTotalAmount).sum();
        double advanceDeposits = all.stream().mapToDouble(Appointment::getAdvancePaid).sum();
        long confirmed = all.stream().filter(a -> "CONFIRMED".equalsIgnoreCase(a.getBookingStatus())).count();
        long completed = all.stream().filter(a -> "COMPLETED".equalsIgnoreCase(a.getBookingStatus())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", all.size());
        stats.put("confirmedBookings", confirmed);
        stats.put("completedBookings", completed);
        stats.put("totalGrossRevenue", totalRevenue);
        stats.put("totalAdvanceDeposits", advanceDeposits);
        stats.put("averageBookingValue", all.isEmpty() ? 0 : Math.round(totalRevenue / all.size()));
        return stats;
    }

    private void syncCustomerRecord(String name, String phone, String email, String serviceName, double amount) {
        if (phone == null || phone.trim().isEmpty()) return;
        
        Optional<Customer> existing = customerRepository.findByPhone(phone);
        if (existing.isPresent()) {
            Customer c = existing.get();
            c.setTotalVisits(c.getTotalVisits() + 1);
            c.setTotalSpent(c.getTotalSpent() + amount);
            c.setLastVisit("Today");
            c.setFavoriteService(serviceName);
            if (c.getTotalVisits() >= 4) {
                c.setTier("VIP Member");
            }
            customerRepository.save(c);
        } else {
            Customer newCustomer = new Customer(
                    "cust_" + System.currentTimeMillis(),
                    name,
                    phone,
                    email != null ? email : "",
                    1,
                    amount,
                    "Today",
                    serviceName,
                    "Today",
                    "New Client"
            );
            customerRepository.save(newCustomer);
        }
    }
}
