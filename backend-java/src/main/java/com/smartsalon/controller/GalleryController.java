package com.smartsalon.controller;

import com.smartsalon.model.GalleryItem;
import com.smartsalon.repository.GalleryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "*")
public class GalleryController {

    @Autowired
    private GalleryItemRepository galleryRepository;

    @GetMapping
    public ResponseEntity<List<GalleryItem>> getAllGallery(
            @RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty() && !"All".equalsIgnoreCase(category)) {
            return ResponseEntity.ok(galleryRepository.findByCategory(category));
        }
        return ResponseEntity.ok(galleryRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<GalleryItem> createGalleryItem(@RequestBody GalleryItem item) {
        if (item.getId() == null || item.getId().isEmpty()) {
            item.setId("gal-" + System.currentTimeMillis());
        }
        return ResponseEntity.ok(galleryRepository.save(item));
    }
}
