package com.smartsalon.service;

import com.smartsalon.dto.AiChatRequest;
import com.smartsalon.dto.AiChatResponse;
import com.smartsalon.dto.AiRecommendRequest;
import com.smartsalon.dto.AiRecommendResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.model:gemini-3.7-flash}")
    private String geminiModel;

    private final RestTemplate restTemplate = new RestTemplate();

    public AiChatResponse chat(AiChatRequest request) {
        String message = request.getMessage();
        if (message == null || message.trim().isEmpty()) {
            return new AiChatResponse("Please provide a question or service inquiry.");
        }

        // Try Gemini API if API key is configured
        if (geminiApiKey != null && !geminiApiKey.trim().isEmpty()) {
            try {
                String systemInstruction = "You are the friendly, luxury beauty and grooming expert AI assistant for 'SMART SALON' (an AI-Enabled Smart Salon and Parlour). "
                        + "Pricing: Transparent online booking with just a 10% advance deposit via Razorpay, and 90% balance payable at the counter. "
                        + "Offers: GLOW20 (20% off facials), FIRST10 (10% off for first-time), BRIDAL500 (₹500 off bridal). "
                        + "Keep answers warm, luxury-focused, concise, and helpful.";

                String url = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + geminiApiKey;

                JSONObject payload = new JSONObject();
                JSONObject content = new JSONObject();
                JSONArray parts = new JSONArray();
                parts.put(new JSONObject().put("text", systemInstruction + "\n\nUser: " + message));
                content.put("parts", parts);
                payload.put("contents", new JSONArray().put(content));

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                HttpEntity<String> entity = new HttpEntity<>(payload.toString(), headers);

                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JSONObject resJson = new JSONObject(response.getBody());
                    JSONArray candidates = resJson.optJSONArray("candidates");
                    if (candidates != null && candidates.length() > 0) {
                        String reply = candidates.getJSONObject(0)
                                .getJSONObject("content")
                                .getJSONArray("parts")
                                .getJSONObject(0)
                                .getString("text");
                        return new AiChatResponse(reply);
                    }
                }
            } catch (Exception e) {
                System.err.println("Gemini Java client fallback triggered: " + e.getMessage());
            }
        }

        // Smart Heuristic Domain Fallback
        String lower = message.toLowerCase();
        String reply = "Welcome to Smart Salon! We offer certified hair styling, facial therapy, bridal makeovers, and men's executive grooming. You can book any slot with just a 10% advance deposit via Razorpay!";

        if (lower.contains("price") || lower.contains("cost") || lower.contains("advance") || lower.contains("deposit") || lower.contains("10%")) {
            reply = "At Smart Salon, our pricing is fully transparent! You only need to pay a 10% advance deposit through Razorpay (UPI/Cards/Netbanking). The remaining 90% balance is payable at the salon counter after your service.";
        } else if (lower.contains("facial") || lower.contains("skin") || lower.contains("glow") || lower.contains("dull")) {
            reply = "For glowing skin, we recommend our signature 'Radiance Facial Therapy' (₹1,800) or 'Hydra-Glow Deep Pore Treatment' (₹2,500). Use coupon code 'GLOW20' for 20% off!";
        } else if (lower.contains("hair") || lower.contains("cut") || lower.contains("keratin") || lower.contains("beard") || lower.contains("men")) {
            reply = "Our master stylists offer Layered Haircuts (₹850), Executive Men's Beard & Hair Styling (₹650), and Brazilian Keratin Smooth Therapy (₹4,200). Would you like to schedule an appointment?";
        } else if (lower.contains("bridal") || lower.contains("wedding")) {
            reply = "We provide complete HD Bridal Makeovers and Pre-Bridal Consultation packages starting from ₹6,500. Use coupon code 'BRIDAL500' for ₹500 off!";
        } else if (lower.contains("time") || lower.contains("hour") || lower.contains("open")) {
            reply = "We are open Monday to Sunday from 09:30 AM to 08:30 PM. Booking in advance guarantees zero waiting time with your chosen stylist!";
        }

        return new AiChatResponse(reply);
    }

    public AiRecommendResponse recommend(AiRecommendRequest req) {
        AiRecommendResponse res = new AiRecommendResponse();
        List<String> services = new ArrayList<>();
        double estimatedTotal = 2450.0;

        String interest = req.getServiceInterest() != null ? req.getServiceInterest().toLowerCase() : "";
        String gender = req.getGender() != null ? req.getGender().toLowerCase() : "women";

        if (interest.contains("hair") || interest.contains("cut") || interest.contains("keratin")) {
            services.add(gender.equals("men") ? "Executive Haircut & Beard Craft" : "Signature Layered Haircut & Blowdry");
            services.add(gender.equals("men") ? "Charcoal Scalp Detox Therapy" : "Moroccan Argan Hair Spa Treatment");
            res.setSuggestedStylist(gender.equals("men") ? "Aarav Sharma (Master Barber)" : "Priya Mehta (Creative Hair Director)");
            estimatedTotal = gender.equals("men") ? 1450.0 : 2650.0;
        } else if (interest.contains("skin") || interest.contains("facial")) {
            services.add("Radiance 24K Gold Facial Therapy");
            services.add("De-Tan Brightening Neck & Hand Polish");
            res.setSuggestedStylist("Ananya Roy (Senior Aesthetician)");
            estimatedTotal = 2750.0;
        } else if (interest.contains("bridal") || interest.contains("wedding")) {
            services.add("Royal Pre-Bridal Radiance Glow Package");
            services.add("HD Airbrush Bridal Makeup & Saree Drape");
            res.setSuggestedStylist("Zoya Khan (Bridal & Makeup Artist)");
            estimatedTotal = 9500.0;
        } else {
            services.add("Signature Hair & Scalp Treatment");
            services.add("Express Glow Facial Cleanse");
            res.setSuggestedStylist("Priya Mehta (Lead Stylist)");
            estimatedTotal = 2200.0;
        }

        res.setSummary("Based on your " + (req.getHairOrSkinConcern() != null ? req.getHairOrSkinConcern() : "preferences")
                + " for " + (req.getOccasion() != null ? req.getOccasion() : "daily grooming")
                + ", our AI specialist recommends a tailored session.");
        res.setRecommendedServiceNames(services);
        res.setRecommendedCoupon(estimatedTotal >= 5000 ? "BRIDAL500" : "GLOW20");
        res.setProfessionalTip("Arrive 10 minutes early to enjoy a complimentary herbal tea consultation.");
        res.setEstimatedTotal(estimatedTotal);
        res.setAdvanceDeposit(Math.round((estimatedTotal * 10) / 100.0));

        return res;
    }
}
