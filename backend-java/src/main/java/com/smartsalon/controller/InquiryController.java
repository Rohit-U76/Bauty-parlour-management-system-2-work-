package com.smartsalon.controller;

import com.smartsalon.model.ContactInquiry;
import com.smartsalon.repository.ContactInquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inquiries")
@CrossOrigin(origins = "*")
public class InquiryController {

    @Autowired
    private ContactInquiryRepository inquiryRepository;

    @GetMapping
    public ResponseEntity<List<ContactInquiry>> getAllInquiries() {
        return ResponseEntity.ok(inquiryRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<ContactInquiry> createInquiry(@RequestBody ContactInquiry inquiry) {
        if (inquiry.getId() == null || inquiry.getId().isEmpty()) {
            inquiry.setId("inq-" + System.currentTimeMillis());
        }
        if (inquiry.getStatus() == null) {
            inquiry.setStatus("NEW");
        }
        if (inquiry.getReceivedDate() == null) {
            inquiry.setReceivedDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        return ResponseEntity.ok(inquiryRepository.save(inquiry));
    }

    @PatchMapping("/{id}/reply")
    public ResponseEntity<?> replyInquiry(@PathVariable String id, @RequestBody Map<String, String> body) {
        String reply = body.get("reply");
        return inquiryRepository.findById(id).map(inq -> {
            inq.setOwnerReply(reply);
            inq.setStatus("RESOLVED");
            return ResponseEntity.ok(inquiryRepository.save(inq));
        }).orElse(ResponseEntity.notFound().build());
    }
}
