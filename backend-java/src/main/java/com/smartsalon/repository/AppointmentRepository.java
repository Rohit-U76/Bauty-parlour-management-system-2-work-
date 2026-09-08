package com.smartsalon.repository;

import com.smartsalon.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    Optional<Appointment> findByBookingRef(String bookingRef);
    List<Appointment> findByClientPhone(String clientPhone);
    List<Appointment> findByDate(String date);
    List<Appointment> findByBookingStatus(String bookingStatus);
    List<Appointment> findByStylistName(String stylistName);
}
