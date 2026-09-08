package com.smartsalon.controller;

import com.smartsalon.dto.AiChatRequest;
import com.smartsalon.dto.AiChatResponse;
import com.smartsalon.dto.AiRecommendRequest;
import com.smartsalon.dto.AiRecommendResponse;
import com.smartsalon.service.GeminiAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private GeminiAiService geminiAiService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        return ResponseEntity.ok(geminiAiService.chat(request));
    }

    @PostMapping("/recommend")
    public ResponseEntity<AiRecommendResponse> recommend(@RequestBody AiRecommendRequest request) {
        return ResponseEntity.ok(geminiAiService.recommend(request));
    }
}
