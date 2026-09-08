package com.smartsalon.service;

import com.smartsalon.model.*;
import com.smartsalon.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class SalonDataInitService implements CommandLineRunner {

    @Autowired private ServiceItemRepository serviceRepository;
    @Autowired private OfferCouponRepository offerRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private ReviewRepository reviewRepository;
    @Autowired private GalleryItemRepository galleryRepository;
    @Autowired private AppointmentRepository appointmentRepository;

    @Override
    public void run(String... args) throws Exception {
        seedServices();
        seedOffers();
        seedCustomers();
        seedReviews();
        seedGallery();
        seedAppointments();
    }

    private void seedServices() {
        if (serviceRepository.count() > 0) return;

        List<ServiceItem> services = Arrays.asList(
                new ServiceItem("srv-1", "Signature Layered Haircut & Blowdry", "Hair Care & Styling", "women", 45, 850.0, 85.0,
                        "Precision artistic haircut tailored to face contours with conditioning hair wash, blowdry styling and serum gloss finish.",
                        "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80", true, 4.9, 128,
                        Arrays.asList("Expert consultation", "Custom blowout", "Heat protectant")),
                new ServiceItem("srv-2", "Radiance 24K Gold Facial Therapy", "Skin & Facial Therapy", "women", 60, 1800.0, 180.0,
                        "Deep cell-cleansing, herbal exfoliation, gold-infused micro-massage and collagen brightening mask for illuminated glow.",
                        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80", true, 4.8, 94,
                        Arrays.asList("Instant skin glow", "Deep pore extraction", "Anti-pigmentation")),
                new ServiceItem("srv-3", "Brazilian Keratin Smooth Therapy", "Hair Care & Styling", "unisex", 150, 4200.0, 420.0,
                        "Frizz-eliminating protein treatment delivering ultra-smooth, high-gloss and manageable hair lasting up to 5 months.",
                        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", false, 4.9, 86,
                        Arrays.asList("Formaldehyde-free", "Silky straight finish", "Humidity shield")),
                new ServiceItem("srv-4", "Executive Haircut & Beard Craft", "Men's Executive Grooming", "men", 45, 650.0, 65.0,
                        "Precision razor fade, hot-towel beard grooming, softening botanical beard oil treatment and scalp massage.",
                        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80", true, 4.9, 112,
                        Arrays.asList("Hot towel compress", "Beard oil shaping", "Scalp acupressure")),
                new ServiceItem("srv-5", "Royal HD Airbrush Bridal Makeover", "Bridal & Pre-Bridal", "women", 180, 8500.0, 850.0,
                        "Luxury high-definition waterproof airbrush bridal makeup, designer hair styling, saree/lehenga draping and lash application.",
                        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80", true, 5.0, 64,
                        Arrays.asList("Long-lasting 18hr finish", "Waterproof airbrush", "Jewelry & drape assistance"))
        );

        serviceRepository.saveAll(services);
    }

    private void seedOffers() {
        if (offerRepository.count() > 0) return;

        List<OfferCoupon> offers = Arrays.asList(
                new OfferCoupon("off-1", "GLOW20", "20% Off All Facials & Skin Therapy", 20, null, 1500.0, "2026-12-31", "Valid on Radiance, Hydra-Glow, and Collagen skin treatments.", true),
                new OfferCoupon("off-2", "FIRST10", "10% Off First Booking Welcome Gift", 10, null, 500.0, "2026-12-31", "Exclusive discount for new clients on any service.", true),
                new OfferCoupon("off-3", "BRIDAL500", "Flat ₹500 Off Royal Bridal Packages", null, 500.0, 5000.0, "2026-12-31", "Special savings on complete pre-bridal and bridal makeovers.", true)
        );

        offerRepository.saveAll(offers);
    }

    private void seedCustomers() {
        if (customerRepository.count() > 0) return;

        List<Customer> customers = Arrays.asList(
                new Customer("cust-1", "Ananya Deshmukh", "+91 98234 11223", "ananya.d@example.com", 6, 12400.0, "2026-08-10", "Radiance 24K Gold Facial", "2025-04-12", "VIP Member"),
                new Customer("cust-2", "Vikram Rathore", "+91 97112 33445", "vikram.r@example.com", 4, 3800.0, "2026-08-08", "Executive Haircut & Beard Craft", "2025-09-20", "VIP Member"),
                new Customer("cust-3", "Sneha Kulkarni", "+91 99345 88990", "sneha.k@example.com", 1, 8500.0, "2026-08-14", "Royal HD Airbrush Bridal Makeover", "2026-08-14", "New Client")
        );

        customerRepository.saveAll(customers);
    }

    private void seedReviews() {
        if (reviewRepository.count() > 0) return;

        List<Review> reviews = Arrays.asList(
                new Review("rev-1", "Meera Joshi", 5.0, "Radiance 24K Gold Facial Therapy", "The best facial I have ever had! The 10% online deposit booking made scheduling effortless.", "2026-08-10", true, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"),
                new Review("rev-2", "Rohan Mehta", 5.0, "Executive Haircut & Beard Craft", "Aarav is a master barber! The precision razor fade and hot towel treatment were supreme.", "2026-08-05", true, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80")
        );

        reviewRepository.saveAll(reviews);
    }

    private void seedGallery() {
        if (galleryRepository.count() > 0) return;

        List<GalleryItem> gallery = Arrays.asList(
                new GalleryItem("gal-1", "Royal Bridal Makeover", "HD Airbrush & Saree Drape", "Bridal", "Bridal Glow", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"),
                new GalleryItem("gal-2", "Balayage Caramel Ombré", "Dimensional Highlights", "Hair Care", "Hair Color", "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80"),
                new GalleryItem("gal-3", "Luxury Salon Ambience", "Gold Accent Styling Stations", "Salon Interior", "Interior", "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80")
        );

        galleryRepository.saveAll(gallery);
    }

    private void seedAppointments() {
        if (appointmentRepository.count() > 0) return;

        List<Appointment> list = Arrays.asList(
                new Appointment("apt-101", "SS-2026-849201", "Pooja Sharma", "+91 98450 12345", "pooja.sharma@example.com",
                        "srv-2", "Radiance 24K Gold Facial Therapy", "Skin & Facial Therapy", "2026-08-15", "11:00 AM",
                        "Ananya Roy", 1800.0, 180.0, 1620.0, "PAID", "CONFIRMED", "pay_rzp_98412", "order_rzp_98412",
                        "2026-08-14T10:15:00", "Prefers organic facial mask."),
                new Appointment("apt-102", "SS-2026-391024", "Aditya Verma", "+91 98111 22334", "aditya.v@example.com",
                        "srv-4", "Executive Haircut & Beard Craft", "Men's Executive Grooming", "2026-08-15", "03:30 PM",
                        "Aarav Sharma", 650.0, 65.0, 585.0, "PAID", "CONFIRMED", "pay_rzp_11094", "order_rzp_11094",
                        "2026-08-14T12:00:00", "Zero side fade.")
        );

        appointmentRepository.saveAll(list);
    }
}
