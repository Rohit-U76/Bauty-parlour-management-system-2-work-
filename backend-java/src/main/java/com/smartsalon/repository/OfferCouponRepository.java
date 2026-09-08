package com.smartsalon.repository;

import com.smartsalon.model.OfferCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfferCouponRepository extends JpaRepository<OfferCoupon, String> {
    Optional<OfferCoupon> findByCodeIgnoreCase(String code);
    List<OfferCoupon> findByActiveTrue();
}
