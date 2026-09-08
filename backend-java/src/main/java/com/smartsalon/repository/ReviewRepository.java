package com.smartsalon.repository;

import com.smartsalon.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByVerifiedBookingTrue();
    List<Review> findByServiceName(String serviceName);
}
