-- =============================================================================
-- SMART SALON & PARLOUR MANAGEMENT SYSTEM
-- MySQL Relational Database Schema (MySQL 8.0+)
-- =============================================================================

-- Ensure database creation and utf8mb4 encoding for internationalized text & emoji
CREATE DATABASE IF NOT EXISTS `smart_salon_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `smart_salon_db`;
SET FOREIGN_KEY_CHECKS = 0;

-- Set session settings for strict validation
SET foreign_key_checks = 0;
DROP TABLE IF EXISTS `salon_settings`;
DROP TABLE IF EXISTS `contact_inquiries`;
DROP TABLE IF EXISTS `offer_coupons`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `appointment_services`;
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `service_price_tiers`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `stylists`;
DROP TABLE IF EXISTS `users`;


-- -----------------------------------------------------------------------------
-- 1. USERS & ACCOUNTS
-- Stores salon customers, staff stylists, and administrators
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `username` VARCHAR(60) DEFAULT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `role` ENUM('ADMIN', 'CUSTOMER', 'STAFF') NOT NULL DEFAULT 'CUSTOMER',
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `pin` VARCHAR(10) DEFAULT NULL COMMENT 'Quick 4-digit PIN for staff or admin terminals',
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `member_tier` ENUM('Standard', 'VIP Member', 'New Client') NOT NULL DEFAULT 'New Client',
  `loyalty_points` INT UNSIGNED NOT NULL DEFAULT 0,
  `total_visits` INT UNSIGNED NOT NULL DEFAULT 0,
  `total_spent` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `last_visit` DATETIME DEFAULT NULL,
  `preferred_services` JSON DEFAULT NULL COMMENT 'Array of service IDs or category names',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`),
  KEY `idx_users_phone` (`phone`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. STYLISTS & SPECIALISTS
-- Team members available for appointment booking assignments
-- -----------------------------------------------------------------------------
CREATE TABLE `stylists` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `title` VARCHAR(100) NOT NULL DEFAULT 'Senior Stylist',
  `gender` ENUM('women', 'men', 'unisex') NOT NULL DEFAULT 'unisex',
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(191) DEFAULT NULL,
  `specialty` VARCHAR(150) NOT NULL,
  `experience_years` INT UNSIGNED NOT NULL DEFAULT 3,
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 4.80,
  `reviews_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `is_available` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. SERVICES CATALOG
-- Salon services, categorization, base pricing, and duration
-- -----------------------------------------------------------------------------
CREATE TABLE `services` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `category` ENUM(
    'Make Up',
    'Skin Services',
    'Hair Services',
    'Color Services',
    'Hair Chemical Services',
    'Hair Care & Styling',
    'Skin & Facial Therapy',
    'Bridal & Pre-Bridal',
    'Men\'s Executive Grooming',
    'Nail Art & Extensions',
    'Spa & Body Treatments'
  ) NOT NULL,
  `gender` ENUM('women', 'men', 'unisex') NOT NULL DEFAULT 'unisex',
  `duration_minutes` INT UNSIGNED NOT NULL DEFAULT 45,
  `price` DECIMAL(10, 2) NOT NULL,
  `price_display` VARCHAR(100) DEFAULT NULL COMMENT 'e.g. "₹2,000 / ₹2,500" or tier indicator',
  `advance_deposit` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '10% advance deposit for slots',
  `description` TEXT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `popular` BOOLEAN NOT NULL DEFAULT FALSE,
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 4.90,
  `reviews_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `benefits` JSON DEFAULT NULL COMMENT 'JSON array of string bullet points',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_services_category` (`category`),
  KEY `idx_services_gender` (`gender`),
  KEY `idx_services_popular` (`popular`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3b. SERVICE PRICE TIERS / VARIANTS (Optional sub-tiers e.g. Length/Product)
-- -----------------------------------------------------------------------------
CREATE TABLE `service_price_tiers` (
  `id` VARCHAR(64) NOT NULL,
  `service_id` VARCHAR(64) NOT NULL,
  `label` VARCHAR(120) NOT NULL COMMENT 'e.g. "Shoulder Length", "Waist Length"',
  `price` DECIMAL(10, 2) NOT NULL,
  `duration_minutes` INT UNSIGNED DEFAULT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_service_tiers_service_id` (`service_id`),
  CONSTRAINT `fk_service_tiers_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. APPOINTMENTS & BOOKINGS
-- BIGINT PK for ACID row identity. user_id / stylist_id remain VARCHAR(64) so
-- foreign keys match existing `users.id` and `stylists.id` (VARCHAR PKs).
-- Line items live in appointment_services (bundles / multi-service bookings).
-- -----------------------------------------------------------------------------
CREATE TABLE `appointments` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `booking_ref` VARCHAR(32) NOT NULL COMMENT 'Readable code e.g. SS-20260908-4821',
  `user_id` VARCHAR(64) DEFAULT NULL COMMENT 'Optional linked registered user (guest bookings NULL)',
  `client_name` VARCHAR(120) NOT NULL,
  `client_phone` VARCHAR(20) NOT NULL,
  `client_email` VARCHAR(191) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `appointment_date` DATE NOT NULL,
  `time_slot` VARCHAR(30) NOT NULL COMMENT 'e.g. "10:30 AM", "02:00 PM"',
  `stylist_id` VARCHAR(64) DEFAULT NULL,
  `stylist_name` VARCHAR(120) NOT NULL DEFAULT 'Any Available Expert',
  `total_amount` DECIMAL(10, 2) NOT NULL,
  `advance_paid` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `balance_due` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `booking_status` ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `payment_status` ENUM('PENDING', 'PAID', 'PARTIAL', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `payment_id` VARCHAR(100) DEFAULT NULL,
  `razorpay_order_id` VARCHAR(100) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `active_slot_key` VARCHAR(180) GENERATED ALWAYS AS (
    CASE
      WHEN `booking_status` IN ('PENDING', 'CONFIRMED') AND `stylist_id` IS NOT NULL
        THEN CONCAT(`appointment_date`, '|', `time_slot`, '|', `stylist_id`)
      ELSE NULL
    END
  ) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_appointments_booking_ref` (`booking_ref`),
  UNIQUE KEY `uk_appointments_active_stylist_slot` (`active_slot_key`),
  KEY `idx_appointments_user_id` (`user_id`),
  KEY `idx_appointments_stylist_id` (`stylist_id`),
  KEY `idx_appointments_date_slot` (`appointment_date`, `time_slot`),
  KEY `idx_appointments_phone` (`client_phone`),
  KEY `idx_appointments_status` (`booking_status`)
  -- CONSTRAINT `fk_appointments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
-- CONSTRAINT `fk_appointments_stylist` FOREIGN KEY (`stylist_id`) REFERENCES `stylists` (`id`) ON DELETE SET NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4b. APPOINTMENT LINE ITEMS (one booking can include multiple services / bundles)
-- service_id is a snapshot string so custom bundles are not blocked by catalog FK.
-- -----------------------------------------------------------------------------
CREATE TABLE `appointment_services` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `appointment_id` BIGINT NOT NULL,
  `service_id` VARCHAR(64) DEFAULT NULL,
  `service_name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `duration_minutes` INT UNSIGNED NOT NULL DEFAULT 45,
  PRIMARY KEY (`id`),
  KEY `idx_appointment_services_appointment_id` (`appointment_id`),
  CONSTRAINT `fk_appointment_services_appointment`
    FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. REVIEWS & RATINGS
-- Feedback, aspect sub-ratings, sentiment, and salon responses
-- -----------------------------------------------------------------------------
CREATE TABLE `reviews` (
  `id` VARCHAR(64) NOT NULL,
  `appointment_id` BIGINT DEFAULT NULL,
  `booking_ref` VARCHAR(32) DEFAULT NULL,
  `user_id` VARCHAR(64) DEFAULT NULL,
  `client_name` VARCHAR(120) NOT NULL,
  `client_phone` VARCHAR(20) DEFAULT NULL,
  `client_email` VARCHAR(191) DEFAULT NULL,
  `service_name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `rating` TINYINT UNSIGNED NOT NULL COMMENT 'Overall rating 1-5',
  `hygiene_rating` TINYINT UNSIGNED DEFAULT 5,
  `stylist_skill_rating` TINYINT UNSIGNED DEFAULT 5,
  `punctuality_rating` TINYINT UNSIGNED DEFAULT 5,
  `value_rating` TINYINT UNSIGNED DEFAULT 5,
  `recommend` BOOLEAN NOT NULL DEFAULT TRUE,
  `nps_score` TINYINT UNSIGNED DEFAULT 10 COMMENT '0-10 score',
  `comment` TEXT NOT NULL,
  `tags` JSON DEFAULT NULL COMMENT 'JSON array of tag strings e.g. ["Hygienic", "Master Stylist"]',
  `verified_booking` BOOLEAN NOT NULL DEFAULT TRUE,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `stylist_name` VARCHAR(120) DEFAULT NULL,
  `owner_reply` TEXT DEFAULT NULL,
  `owner_reply_date` DATETIME DEFAULT NULL,
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `sentiment` ENUM('positive', 'neutral', 'critical') NOT NULL DEFAULT 'positive',
  `status` ENUM('published', 'under_review', 'resolved') NOT NULL DEFAULT 'published',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_appointment_id` (`appointment_id`),
  KEY `idx_reviews_booking_ref` (`booking_ref`),
  KEY `idx_reviews_rating` (`rating`),
  KEY `idx_reviews_featured` (`featured`),
  KEY `idx_reviews_status` (`status`),
  CONSTRAINT `fk_reviews_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. OFFER COUPONS & PROMO CODES
-- Promotional discount codes for service bookings
-- -----------------------------------------------------------------------------
CREATE TABLE `offer_coupons` (
  `id` VARCHAR(64) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `discount_percent` DECIMAL(5, 2) DEFAULT NULL,
  `discount_amount` DECIMAL(10, 2) DEFAULT NULL,
  `min_booking_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `valid_till` DATE NOT NULL,
  `description` TEXT NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_offer_coupons_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. CONTACT INQUIRIES & LEADS
-- Customer support and service consultation messages
-- -----------------------------------------------------------------------------
CREATE TABLE `contact_inquiries` (
  `id` VARCHAR(64) NOT NULL,
  `client_name` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `service_category` VARCHAR(100) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('NEW', 'IN PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'NEW',
  `owner_reply` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact_inquiries_status` (`status`),
  KEY `idx_contact_inquiries_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. SALON SETTINGS & SYSTEM CONFIGURATION
-- Key-value store for salon contact details, advance percentage, Razorpay keys
-- -----------------------------------------------------------------------------
CREATE TABLE `salon_settings` (
  `key_name` VARCHAR(100) NOT NULL,
  `key_value` TEXT NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- =============================================================================
-- INITIAL SEED DATA
-- Default administrator, stylists, core services, sample booking, and settings
-- =============================================================================

-- 1. Default Admin & Sample Customer
INSERT INTO `users` (`id`, `name`, `username`, `email`, `phone`, `role`, `password_hash`, `pin`, `member_tier`, `loyalty_points`, `total_visits`, `total_spent`)
VALUES
('usr_admin_1', 'Salon Administrator', 'admin', 'admin@modernsalon.com', '+919876543210', 'ADMIN', '$2a$10$exampleHashedPasswordPlaceholder', '1234', 'VIP Member', 1250, 24, 28500.00),
('usr_cust_1', 'Pooja Sharma', 'pooja', 'pooja.sharma@example.com', '+919822334455', 'CUSTOMER', NULL, NULL, 'VIP Member', 320, 6, 8400.00);

-- 2. Core Stylists
INSERT INTO `stylists` (`id`, `name`, `title`, `gender`, `specialty`, `experience_years`, `rating`, `reviews_count`, `avatar_url`, `is_available`)
VALUES
('sty_1', 'Aniket Shinde', 'Master Hair & Beard Stylist', 'unisex', 'Creative Fades, Beard Architecture & Keratin', 8, 4.95, 128, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80', TRUE),
('sty_2', 'Sneha Kulkarni', 'Senior Aesthetician & Bridal Artist', 'women', 'HD Bridal Makeup & Hydrating Facials', 6, 4.90, 94, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop&q=80', TRUE),
('sty_3', 'Rohan Mane', 'Color & Texture Specialist', 'unisex', 'Balayage, Botoplex & Hair Chemical Treatments', 5, 4.88, 72, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&q=80', TRUE);

-- 3. Core Services
INSERT INTO `services` (`id`, `name`, `category`, `gender`, `duration_minutes`, `price`, `price_display`, `advance_deposit`, `description`, `image_url`, `popular`, `rating`, `reviews_count`, `benefits`)
VALUES
(
  'srv_bridal_hd',
  'Luxury HD Bridal Makeover & Draping',
  'Bridal & Pre-Bridal',
  'women',
  180,
  12500.00,
  '₹12,500',
  1250.00,
  'Flawless High-Definition makeup with premium international brands, saree draping, hairstyling, and lash extensions for your big day.',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&fit=crop&q=80',
  TRUE,
  4.98,
  142,
  JSON_ARRAY('Sweat-proof 16hr wear', 'Includes custom hair accessories & lashes', 'Pre-event skin prep consultation')
),
(
  'srv_hydra_facial',
  'Hydra-Glow Medical Grade Facial Therapy',
  'Skin & Facial Therapy',
  'unisex',
  60,
  2499.00,
  '₹2,499',
  249.90,
  'Deep pore vacuum extraction, antioxidant infusion, and LED light therapy for intense hydration and immediate luminosity.',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&fit=crop&q=80',
  TRUE,
  4.92,
  89,
  JSON_ARRAY('Instant glass-skin radiance', 'Removes deep blackheads & whiteheads', 'Stimulates collagen production')
),
(
  'srv_men_executive',
  'Royal Executive Beard & Haircut Spa',
  'Men\'s Executive Grooming',
  'men',
  50,
  799.00,
  '₹799',
  79.90,
  'Precision fade or scissor cut, warm essential towel steam, precision straight-edge beard sculpting, and relaxing head massage.',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&fit=crop&q=80',
  TRUE,
  4.89,
  210,
  JSON_ARRAY('Hot towel charcoal treatment', 'Precision beard shaping', 'Invigorating scalp massage')
),
(
  'srv_botoplex',
  'Botoplex Nanoplastia Hair Smoothing',
  'Hair Chemical Services',
  'unisex',
  150,
  4999.00,
  '₹4,999 - ₹6,500',
  499.90,
  'Formaldehyde-free organic protein treatment providing mirror-like shine and frizz elimination lasting up to 5 months.',
  'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&fit=crop&q=80',
  FALSE,
  4.90,
  64,
  JSON_ARRAY('0% Formaldehyde & eye irritation', 'Smooth wash-and-go hair', 'Infused with argan & caviar oils')
);

-- 4. Initial Sample Appointment (AUTO_INCREMENT id)
INSERT INTO `appointments` (
  `booking_ref`, `user_id`, `client_name`, `client_phone`, `client_email`,
  `category`, `appointment_date`, `time_slot`,
  `stylist_id`, `stylist_name`, `total_amount`, `advance_paid`, `balance_due`,
  `payment_status`, `booking_status`, `payment_id`, `notes`
) VALUES (
  'SS-20260909-8801',
  'usr_cust_1',
  'Pooja Sharma',
  '+919822334455',
  'pooja.sharma@example.com',
  'Skin & Facial Therapy',
  CURDATE() + INTERVAL 1 DAY,
  '11:45 AM',
  'sty_2',
  'Sneha Kulkarni',
  2499.00,
  249.90,
  2249.10,
  'PAID',
  'CONFIRMED',
  'pay_sample_test_razorpay_998',
  'Client requested sensitive skin serum application.'
);

SET @apt_id = LAST_INSERT_ID();

INSERT INTO `appointment_services` (`appointment_id`, `service_id`, `service_name`, `price`, `duration_minutes`)
VALUES (@apt_id, 'srv_hydra_facial', 'Hydra-Glow Medical Grade Facial Therapy', 2499.00, 60);

-- 5. Verified Review
INSERT INTO `reviews` (
  `id`, `appointment_id`, `booking_ref`, `user_id`, `client_name`, `client_phone`,
  `client_email`, `service_name`, `category`, `rating`, `hygiene_rating`,
  `stylist_skill_rating`, `punctuality_rating`, `value_rating`, `recommend`,
  `nps_score`, `comment`, `tags`, `verified_booking`, `stylist_name`,
  `owner_reply`, `owner_reply_date`, `featured`, `sentiment`, `status`
) VALUES (
  'rev_1',
  @apt_id,
  'SS-20260909-8801',
  'usr_cust_1',
  'Pooja Sharma',
  '+919822334455',
  'pooja.sharma@example.com',
  'Hydra-Glow Medical Grade Facial Therapy',
  'Skin & Facial Therapy',
  5,
  5,
  5,
  5,
  5,
  TRUE,
  10,
  'Absolutely magical experience at Modern Unisex Salon! Sneha took incredible care of my sensitive skin and the glow lasted well over a week.',
  JSON_ARRAY('Glass Skin', 'Hygienic', 'Friendly Staff'),
  TRUE,
  'Sneha Kulkarni',
  'Thank you so much Pooja! We are delighted you loved the Hydra-Glow treatment. Looking forward to welcoming you back!',
  NOW(),
  TRUE,
  'positive',
  'published'
);

-- 6. Promo Offer
INSERT INTO `offer_coupons` (`id`, `code`, `title`, `discount_percent`, `min_booking_amount`, `valid_till`, `description`, `is_active`)
VALUES
('off_welcome15', 'GLOW15', '15% Off Your First Visit', 15.00, 1000.00, '2026-12-31', 'Enjoy 15% discount on all premium skin and hair treatments.', TRUE),
('off_combo20', 'BRIDAL20', 'Flat 20% Off Bridal Packages', 20.00, 8000.00, '2026-12-31', 'Exclusive discount for advance wedding and pre-bridal reservations.', TRUE);

-- 7. System Settings
INSERT INTO `salon_settings` (`key_name`, `key_value`, `description`)
VALUES
('salon_name', 'Modern Unisex Salon', 'Public display name of the salon'),
('tagline', 'Luxury Grooming & Aesthetic Studio', 'Subtitle and branding line'),
('phone', '+91 98765 43210', 'Primary salon appointment WhatsApp / phone'),
('email', 'contact@modernsalon.com', 'Official inquiries email'),
('advance_deposit_percent', '10', 'Required deposit percentage for reserving appointment slots'),
('currency_symbol', '₹', 'Currency display symbol'),
('booking_auto_confirm', 'true', 'Automatically confirm bookings once 10% advance is paid');

SET FOREIGN_KEY_CHECKS = 1;
