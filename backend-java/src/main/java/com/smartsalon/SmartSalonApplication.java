package com.smartsalon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartSalonApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartSalonApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println("🌟 SMART SALON SPRING BOOT BACKEND STARTED SUCCESSFULLY");
        System.out.println("👉 REST API: http://localhost:8080/api/health");
        System.out.println("👉 H2 Database Console: http://localhost:8080/h2-console");
        System.out.println("👉 10% Advance Razorpay Payment System Ready");
        System.out.println("=======================================================\n");
    }
}
