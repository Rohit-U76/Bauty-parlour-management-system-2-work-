package com.smartsalon.controller;

import com.smartsalon.model.OfferCoupon;
import com.smartsalon.repository.OfferCouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@CrossOrigin(origins = "*")
public class OfferController {

    @Autowired
    private OfferCouponRepository offerRepository;

    @GetMapping
    public ResponseEntity<List<OfferCoupon>> getAllOffers() {
        return ResponseEntity.ok(offerRepository.findAll());
    }

    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validateCoupon(@PathVariable String code) {
        return offerRepository.findByCodeIgnoreCase(code)
                .filter(OfferCoupon::isActive)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OfferCoupon> createOffer(@RequestBody OfferCoupon offer) {
        if (offer.getId() == null || offer.getId().isEmpty()) {
            offer.setId("off-" + System.currentTimeMillis());
        }
        return ResponseEntity.ok(offerRepository.save(offer));
    }
}
