package com.smartsalon.repository;

import com.smartsalon.model.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryItemRepository extends JpaRepository<GalleryItem, String> {
    List<GalleryItem> findByCategory(String category);
}
