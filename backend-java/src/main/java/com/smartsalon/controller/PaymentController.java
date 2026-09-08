package com.smartsalon.controller;

import com.smartsalon.dto.RazorpayOrderRequest;
import com.smartsalon.dto.RazorpayOrderResponse;
import com.smartsalon.dto.RazorpayVerifyRequest;
import com.smartsalon.dto.RazorpayVerifyResponse;
import com.smartsalon.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@RequestBody RazorpayOrderRequest request) {
        RazorpayOrderResponse response = paymentService.createAdvanceOrder(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<RazorpayVerifyResponse> verifyPayment(@RequestBody RazorpayVerifyRequest request) {
        RazorpayVerifyResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(response);
    }
}
