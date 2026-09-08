package com.smartsalon.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "ok");
        res.put("service", "Smart Salon Spring Boot Java Backend");
        res.put("version", "1.0.0");
        res.put("timestamp", LocalDateTime.now().toString());
        res.put("database", "JPA Hibernate Active");
        res.put("paymentGateway", "Razorpay 10% Advance Deposit System Active");
        return ResponseEntity.ok(res);
    }
}
