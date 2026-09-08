package com.smartsalon.controller;

import com.smartsalon.dto.ApiResponse;
import com.smartsalon.model.ServiceItem;
import com.smartsalon.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceItemRepository serviceRepository;

    @GetMapping
    public ResponseEntity<List<ServiceItem>> getAllServices(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String gender) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(serviceRepository.findByCategory(category));
        }
        if (gender != null && !gender.isEmpty()) {
            return ResponseEntity.ok(serviceRepository.findByGender(gender));
        }
        return ResponseEntity.ok(serviceRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable String id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ServiceItem> createService(@RequestBody ServiceItem item) {
        if (item.getId() == null || item.getId().isEmpty()) {
            item.setId("srv-" + System.currentTimeMillis());
        }
        if (item.getAdvanceDeposit() <= 0) {
            item.setAdvanceDeposit(Math.round((item.getPrice() * 10) / 100.0));
        }
        ServiceItem saved = serviceRepository.save(item);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable String id, @RequestBody ServiceItem updated) {
        return serviceRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setCategory(updated.getCategory());
            existing.setGender(updated.getGender());
            existing.setDurationMinutes(updated.getDurationMinutes());
            existing.setPrice(updated.getPrice());
            existing.setAdvanceDeposit(Math.round((updated.getPrice() * 10) / 100.0));
            existing.setDescription(updated.getDescription());
            existing.setImageUrl(updated.getImageUrl());
            existing.setPopular(updated.isPopular());
            return ResponseEntity.ok(serviceRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable String id) {
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Service deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, "Service not found"));
    }
}
