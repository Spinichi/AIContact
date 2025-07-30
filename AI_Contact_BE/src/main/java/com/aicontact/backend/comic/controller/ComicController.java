package com.aicontact.backend.comic.controller;

import com.aicontact.backend.comic.dto.ComicRequestDto;
import com.aicontact.backend.comic.service.DallePromptBuilder;
import com.aicontact.backend.comic.service.DalleService;
import com.aicontact.backend.comic.service.GptScenarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comic")
public class ComicController {

    private final GptScenarioService gptService;
    private final DallePromptBuilder promptBuilder;
    private final DalleService dalleService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateComic(@RequestBody ComicRequestDto request) {
        try {
            String gptResult = gptService.getComicPanels(request.getLocation(), request.getActivity(), request.getWeather());
            String dallePrompt = promptBuilder.build(gptResult);
            String imageUrl = dalleService.generateImage(dallePrompt);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}

