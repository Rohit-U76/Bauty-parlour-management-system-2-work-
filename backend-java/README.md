# 🌟 SMART SALON - Java Spring Boot Backend

Complete production-grade Spring Boot 3 + Java 17 backend for the **Smart Salon & Parlour Management System**.

---

## 🚀 Features Included
- **10% Advance Deposit Razorpay Engine**: Server-side order creation (`/api/payment/create-order`) and payment verification (`/api/payment/verify`).
- **Appointment Management & Scheduling**: Booking creation, status updates (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), reference lookup (`SS-YYYY-XXXXXX`).
- **Customer CRM Sync**: Tracks client visit counts, total spent, tier upgrades (`New Client`, `VIP Member`).
- **AI Beauty Assistant & Quiz Recommendations**: Gemini API integration with domain beauty & grooming heuristic fallbacks (`/api/ai/chat`, `/api/ai/recommend`).
- **Service Catalog & Category Filtering**: REST endpoints for services, categories, gender targeting (`women`, `men`, `unisex`), dynamic 10% advance calculations.
- **Reviews, Offers & Coupons, Inquiries, and Gallery**: Full CRUD repositories with Spring Data JPA.
- **Database Support**: Native MySQL Relational Database support for production & client deployment, with zero-loss migration tools and optional isolated H2 profile.

---

## 🛠️ Requirements
- **Java**: JDK 17 or later
- **Maven**: 3.8+ (or use `./mvnw`)
- **MySQL**: 8.0+ running on port 3306 (database: `smart_salon_db`)

---

## 🏃 How to Run

### 1. Run Locally with Maven (MySQL Mode)
```bash
cd backend-java
mvn clean spring-boot:run
```
The server will start at: `http://localhost:8080` and automatically connect to MySQL `smart_salon_db`.

### 2. Optional: Run with Isolated H2 Profile (Testing only)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

### 3. Build JAR file for Production Deployment
```bash
mvn clean package -DskipTests
java -jar target/smart-salon-backend-1.0.0.jar
```

---

## 📦 Docker Deployment

Build and run with Docker:
```bash
cd backend-java
docker build -t smart-salon-backend .
docker run -p 8080:8080 -e RAZORPAY_KEY_ID=your_key -e GEMINI_API_KEY=your_key smart-salon-backend
```

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & system status |
| `POST` | `/api/payment/create-order` | Calculate 10% advance deposit & generate Razorpay order |
| `POST` | `/api/payment/verify` | Verify Razorpay payment signature & confirm booking |
| `GET` | `/api/appointments` | Get all salon appointments |
| `POST` | `/api/appointments` | Book new appointment |
| `PATCH` | `/api/appointments/{id}/status` | Update booking status (`CONFIRMED`, `COMPLETED`) |
| `GET` | `/api/appointments/stats/dashboard` | Aggregated revenue & deposit statistics |
| `GET` | `/api/services` | Get services catalog (optional filter `?category=` or `?gender=`) |
| `POST` | `/api/ai/chat` | AI Luxury Beauty Stylist chat with Gemini |
| `POST` | `/api/ai/recommend` | Smart Recommendation Quiz evaluation |
| `GET` | `/api/offers` | Active promotional coupons |
| `GET` | `/api/gallery` | Visual transformation portfolio items |
| `POST` | `/api/inquiries` | Submit contact / bridal consultation inquiry |

---

## ⚙️ Environment Variables
| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | Server HTTP port |
| `RAZORPAY_KEY_ID` | `rzp_test_smart_salon_demo` | Razorpay Merchant Key ID |
| `RAZORPAY_KEY_SECRET` | `your_secret` | Razorpay Secret Key |
| `GEMINI_API_KEY` | `""` | Google Gemini API Key |
| `SPRING_DATASOURCE_URL` | H2 In-Memory | PostgreSQL/MySQL connection string |
