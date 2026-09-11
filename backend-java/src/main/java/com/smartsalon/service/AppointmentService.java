package com.smartsalon.service;

import com.smartsalon.dto.AppointmentRequestDTO;
import com.smartsalon.dto.AppointmentServiceLineDTO;
import com.smartsalon.dto.SlotAvailabilityDTO;
import com.smartsalon.exception.ResourceNotFoundException;
import com.smartsalon.exception.SlotConflictException;
import com.smartsalon.model.Appointment;
import com.smartsalon.model.AppointmentServiceItem;
import com.smartsalon.model.BookingStatus;
import com.smartsalon.model.Customer;
import com.smartsalon.model.PaymentStatus;
import com.smartsalon.repository.AppointmentRepository;
import com.smartsalon.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private static final List<BookingStatus> ACTIVE_STATUSES =
            List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Value("${salon.chairs.capacity:3}")
    private int chairCapacity;

    @Value("${salon.time-slots:09:30 AM,10:30 AM,11:45 AM,01:30 PM,02:45 PM,04:00 PM,05:30 PM,06:45 PM,07:30 PM,08:15 PM}")
    private String timeSlotsCsv;

    @Value("${salon.advance.percentage:10}")
    private int advancePercentage;

    public List<String> getConfiguredSlots() {
        return Arrays.stream(timeSlotsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SlotAvailabilityDTO> getAvailableSlots(LocalDate date) {
        if (date == null) {
            throw new IllegalArgumentException("Date is required");
        }
        List<SlotAvailabilityDTO> result = new ArrayList<>();
        for (String slot : getConfiguredSlots()) {
            result.add(buildSlotDto(date, slot));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAppointments(LocalDate date, BookingStatus status, String search) {
        String term = search == null ? null : search.trim();
        return appointmentRepository.search(date, status, term);
    }

    @Transactional(readOnly = true)
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Appointment> getAppointmentByBookingRef(String bookingRef) {
        if (bookingRef == null || bookingRef.isBlank()) {
            return Optional.empty();
        }
        return appointmentRepository.findByBookingRefIgnoreCase(bookingRef.trim());
    }

    @Transactional(readOnly = true)
    public List<Appointment> getCustomerAppointments(String phone) {
        if (phone == null || phone.isBlank()) {
            throw new IllegalArgumentException("Phone number is required");
        }
        String digits = phone.replaceAll("[^0-9]", "");
        if (digits.length() < 10) {
            throw new IllegalArgumentException("Enter a valid 10-digit phone number");
        }
        if (digits.length() > 10) {
            digits = digits.substring(digits.length() - 10);
        }
        return appointmentRepository.findByClientPhoneContainingOrderByAppointmentDateDescCreatedAtDesc(digits);
    }

    @Transactional
    public Appointment createAppointment(AppointmentRequestDTO dto) {
        validateSlotCatalog(dto.getTimeSlot());
        if (dto.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Appointment date cannot be in the past");
        }

        assertSlotAvailable(dto.getAppointmentDate(), dto.getTimeSlot(), dto.getStylistId());

        BigDecimal total = dto.getTotalAmount().setScale(2, RoundingMode.HALF_UP);
        BigDecimal advance = dto.getAdvancePaid() != null && dto.getAdvancePaid().compareTo(BigDecimal.ZERO) > 0
                ? dto.getAdvancePaid().setScale(2, RoundingMode.HALF_UP)
                : total.multiply(BigDecimal.valueOf(advancePercentage))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        String paymentId = firstNonBlank(dto.getPaymentId(), dto.getRazorpayPaymentId());
        PaymentStatus paymentStatus = dto.getPaymentStatus() != null
                ? dto.getPaymentStatus()
                : (paymentId != null ? PaymentStatus.PAID : PaymentStatus.PENDING);

        BookingStatus bookingStatus = dto.getBookingStatus() != null
                ? dto.getBookingStatus()
                : (paymentStatus == PaymentStatus.PAID ? BookingStatus.CONFIRMED : BookingStatus.PENDING);

        Appointment appointment = new Appointment();
        appointment.setBookingRef(generateBookingRef(dto.getAppointmentDate()));
        appointment.setUserId(blankToNull(dto.getUserId()));
        appointment.setClientName(dto.getClientName().trim());
        appointment.setClientPhone(dto.getClientPhone().trim());
        appointment.setClientEmail(blankToNull(dto.getClientEmail()));
        appointment.setCategory(dto.getCategory());
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setTimeSlot(dto.getTimeSlot().trim());
        appointment.setStylistId(blankToNull(dto.getStylistId()));
        appointment.setStylistName(dto.getStylistName() != null && !dto.getStylistName().isBlank()
                ? dto.getStylistName().trim()
                : "Any Available Expert");
        appointment.setTotalAmount(total);
        appointment.setAdvancePaid(advance);
        appointment.setPaymentId(paymentId);
        appointment.setRazorpayOrderId(blankToNull(dto.getRazorpayOrderId()));
        appointment.setNotes(dto.getNotes());
        appointment.setPaymentStatus(paymentStatus);
        appointment.setBookingStatus(bookingStatus);

        for (AppointmentServiceLineDTO line : resolveServiceLines(dto)) {
            appointment.addService(new AppointmentServiceItem(
                    line.getServiceId(),
                    line.getServiceName(),
                    line.getPrice() != null ? line.getPrice() : total,
                    line.getDurationMinutes() != null ? line.getDurationMinutes() : dto.getDurationMinutes()
            ));
        }

        try {
            Appointment saved = appointmentRepository.saveAndFlush(appointment);
            syncCustomerRecord(
                    saved.getClientName(),
                    saved.getClientPhone(),
                    saved.getClientEmail(),
                    saved.getServiceName(),
                    total.doubleValue()
            );
            return saved;
        } catch (DataIntegrityViolationException ex) {
            throw new SlotConflictException(
                    "This date, time slot, and stylist combination is already booked. Please choose another slot."
            );
        }
    }

    @Transactional
    public Appointment updateStatus(Long id, BookingStatus newStatus) {
        if (newStatus == null) {
            throw new IllegalArgumentException("Status is required");
        }
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        apt.setBookingStatus(newStatus);
        return appointmentRepository.save(apt);
    }

    @Transactional
    public Appointment updatePaymentStatus(Long id, PaymentStatus newStatus, String paymentId) {
        if (newStatus == null) {
            throw new IllegalArgumentException("Payment status is required");
        }
        Appointment apt = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        apt.setPaymentStatus(newStatus);
        if (paymentId != null && !paymentId.isBlank()) {
            apt.setPaymentId(paymentId.trim());
        }
        if (newStatus == PaymentStatus.PAID && apt.getBookingStatus() == BookingStatus.PENDING) {
            apt.setBookingStatus(BookingStatus.CONFIRMED);
        }
        return appointmentRepository.save(apt);
    }

    @Transactional
    public boolean deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            return false;
        }
        appointmentRepository.deleteById(id);
        return true;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        List<Appointment> all = appointmentRepository.findAll();
        List<Appointment> billable = all.stream()
                .filter(a -> a.getBookingStatus() != BookingStatus.CANCELLED)
                .toList();

        BigDecimal totalRevenue = billable.stream()
                .map(Appointment::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal advanceDeposits = billable.stream()
                .map(Appointment::getAdvancePaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long confirmed = all.stream().filter(a -> a.getBookingStatus() == BookingStatus.CONFIRMED).count();
        long completed = all.stream().filter(a -> a.getBookingStatus() == BookingStatus.COMPLETED).count();
        long pending = all.stream().filter(a -> a.getBookingStatus() == BookingStatus.PENDING).count();
        long cancelled = all.stream().filter(a -> a.getBookingStatus() == BookingStatus.CANCELLED).count();

        return Map.of(
                "totalBookings", all.size(),
                "pendingBookings", pending,
                "confirmedBookings", confirmed,
                "completedBookings", completed,
                "cancelledBookings", cancelled,
                "totalGrossRevenue", totalRevenue,
                "totalAdvanceDeposits", advanceDeposits,
                "averageBookingValue", billable.isEmpty()
                        ? BigDecimal.ZERO
                        : totalRevenue.divide(BigDecimal.valueOf(billable.size()), 2, RoundingMode.HALF_UP)
        );
    }

    private void assertSlotAvailable(LocalDate date, String timeSlot, String stylistId) {
        long booked = appointmentRepository.countActiveForSlotForUpdate(date, timeSlot.trim(), ACTIVE_STATUSES);
        if (booked >= chairCapacity) {
            throw new SlotConflictException(
                    "Slot " + timeSlot + " on " + date + " is fully booked (" + chairCapacity + " chairs occupied)."
            );
        }
        if (stylistId != null && !stylistId.isBlank()) {
            boolean stylistTaken = appointmentRepository.existsByAppointmentDateAndTimeSlotAndStylistIdAndBookingStatusIn(
                    date, timeSlot.trim(), stylistId.trim(), ACTIVE_STATUSES);
            if (stylistTaken) {
                throw new SlotConflictException(
                        "This stylist is already booked at " + timeSlot + " on " + date + "."
                );
            }
        }
    }

    private SlotAvailabilityDTO buildSlotDto(LocalDate date, String slot) {
        List<Appointment> active = appointmentRepository.findByAppointmentDateAndTimeSlotAndBookingStatusIn(
                date, slot, ACTIVE_STATUSES);
        long booked = active.size();
        long remaining = Math.max(0, chairCapacity - booked);
        int occupancy = chairCapacity == 0 ? 0 : (int) Math.round((booked * 100.0) / chairCapacity);

        String status;
        String label;
        if (remaining == 0) {
            status = "SOLD_OUT";
            label = "Sold Out";
        } else if (occupancy >= 70) {
            status = "FILLING_FAST";
            label = "Filling Fast";
        } else {
            status = "AVAILABLE";
            label = "Available";
        }

        SlotAvailabilityDTO dto = new SlotAvailabilityDTO();
        dto.setSlot(slot);
        dto.setDate(date);
        dto.setTotalCapacity(chairCapacity);
        dto.setBookedCount(booked);
        dto.setRemainingSeats(remaining);
        dto.setOccupancyPercent(occupancy);
        dto.setStatus(status);
        dto.setStatusLabel(label);
        dto.setSoldOut(remaining == 0);
        dto.setBookedStylistIds(active.stream()
                .map(Appointment::getStylistId)
                .filter(id -> id != null && !id.isBlank())
                .collect(Collectors.toList()));
        return dto;
    }

    private void validateSlotCatalog(String timeSlot) {
        boolean known = getConfiguredSlots().stream().anyMatch(s -> s.equalsIgnoreCase(timeSlot.trim()));
        if (!known) {
            throw new IllegalArgumentException("Invalid time slot. Choose one of the salon operating slots.");
        }
    }

    private List<AppointmentServiceLineDTO> resolveServiceLines(AppointmentRequestDTO dto) {
        List<AppointmentServiceLineDTO> lines = dto.getServices();
        if (lines != null && !lines.isEmpty()) {
            return lines;
        }
        if (dto.getServiceName() == null || dto.getServiceName().isBlank()) {
            throw new IllegalArgumentException("At least one service is required");
        }
        AppointmentServiceLineDTO line = new AppointmentServiceLineDTO();
        line.setServiceId(dto.getServiceId());
        line.setServiceName(dto.getServiceName());
        line.setPrice(dto.getTotalAmount());
        line.setDurationMinutes(dto.getDurationMinutes());
        return List.of(line);
    }

    private String generateBookingRef(LocalDate date) {
        String day = date.format(DateTimeFormatter.BASIC_ISO_DATE);
        for (int attempt = 0; attempt < 8; attempt++) {
            int suffix = ThreadLocalRandom.current().nextInt(1000, 10000);
            String ref = "SS-" + day + "-" + suffix;
            if (appointmentRepository.findByBookingRefIgnoreCase(ref).isEmpty()) {
                return ref;
            }
        }
        return "SS-" + day + "-" + System.currentTimeMillis() % 10000;
    }

    private void syncCustomerRecord(String name, String phone, String email, String serviceName, double amount) {
        if (phone == null || phone.trim().isEmpty()) return;

        Optional<Customer> existing = customerRepository.findByPhone(phone);
        if (existing.isPresent()) {
            Customer c = existing.get();
            c.setTotalVisits(c.getTotalVisits() + 1);
            c.setTotalSpent(c.getTotalSpent() + amount);
            c.setLastVisit(LocalDate.now().toString());
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
                    LocalDate.now().toString(),
                    serviceName != null ? serviceName : "",
                    LocalDate.now().toString(),
                    "New Client"
            );
            customerRepository.save(newCustomer);
        }
    }

    private static String blankToNull(String value) {
        if (value == null || value.isBlank()) return null;
        return value.trim();
    }

    private static String firstNonBlank(String... values) {
        if (values == null) return null;
        for (String value : values) {
            if (value != null && !value.isBlank()) return value.trim();
        }
        return null;
    }
}
