package com.smartsalon.repository;

import com.smartsalon.model.ContactInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, String> {
    List<ContactInquiry> findByStatus(String status);
}
