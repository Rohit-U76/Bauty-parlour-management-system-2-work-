package com.smartsalon.repository;

import com.smartsalon.model.Appointment;
import com.smartsalon.model.BookingStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Optional<Appointment> findByBookingRefIgnoreCase(String bookingRef);

    List<Appointment> findByUserIdOrderByAppointmentDateDescTimeSlotAsc(String userId);

    List<Appointment> findByAppointmentDateAndTimeSlotAndBookingStatusIn(
            LocalDate date, String timeSlot, Collection<BookingStatus> statuses);

    boolean existsByAppointmentDateAndTimeSlotAndStylistIdAndBookingStatusIn(
            LocalDate date, String timeSlot, String stylistId, Collection<BookingStatus> statuses);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT COUNT(a) FROM Appointment a " +
            "WHERE a.appointmentDate = :date AND a.timeSlot = :timeSlot AND a.bookingStatus IN :statuses")
    long countActiveForSlotForUpdate(
            @Param("date") LocalDate date,
            @Param("timeSlot") String timeSlot,
            @Param("statuses") Collection<BookingStatus> statuses);

    @Query("SELECT COUNT(a) FROM Appointment a " +
            "WHERE a.appointmentDate = :date AND a.timeSlot = :timeSlot AND a.bookingStatus IN :statuses")
    long countActiveForSlot(
            @Param("date") LocalDate date,
            @Param("timeSlot") String timeSlot,
            @Param("statuses") Collection<BookingStatus> statuses);

    List<Appointment> findByClientPhoneContainingOrderByAppointmentDateDescCreatedAtDesc(String phone);

    @Query("SELECT a FROM Appointment a WHERE " +
            "(:date IS NULL OR a.appointmentDate = :date) AND " +
            "(:status IS NULL OR a.bookingStatus = :status) AND " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(a.clientName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "a.clientPhone LIKE CONCAT('%', :search, '%') OR " +
            "LOWER(a.bookingRef) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(COALESCE(a.stylistName, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(COALESCE(a.clientEmail, '')) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "ORDER BY a.appointmentDate DESC, a.timeSlot ASC")
    List<Appointment> search(
            @Param("date") LocalDate date,
            @Param("status") BookingStatus status,
            @Param("search") String search);
}
