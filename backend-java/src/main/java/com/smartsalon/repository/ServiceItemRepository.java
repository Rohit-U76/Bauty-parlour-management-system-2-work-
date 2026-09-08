package com.smartsalon.repository;

import com.smartsalon.model.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, String> {
    List<ServiceItem> findByCategory(String category);
    List<ServiceItem> findByGender(String gender);
    List<ServiceItem> findByPopularTrue();
}
