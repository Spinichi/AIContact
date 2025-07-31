package com.aicontact.backend.comic.service;

import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class GptScenarioService {

    private final String OPENAI_API_KEY = "Bearer S13P11A702-921b00de-b1d3-46b4-a329-0e2cd21c41d2";
    private final String ENDPOINT = "https://gms.ssafy.io/gmsapi/api.openai.com/v1/chat/completions";

    public String getComicPanels(String location, String activity, String weather) throws IOException {
        OkHttpClient client = new OkHttpClient();

        String prompt = """
        You are a comic scenario formatter.

        Your task is to take the user's input and return only a list of simple scene descriptions for a multi-panel comic strip.  
        Each panel must represent a different, non-repetitive moment in the day, and should be arranged in chronological order from beginning to end.  
        Each description should be 1 sentence, clearly describing what is happening in that panel — focused on visual elements that can be drawn, not narrative.

        Format:
        Panel 1: [scene description]  
        Panel 2: [scene description]  
        Panel 3: [scene description]  
        Panel 4: [scene description]

        Rules:
        - Do not include any dialogue or text that would appear in the comic  
        - Focus on visual actions, background setting, props, and emotion  
        - Maintain character and location consistency across all panels  
        - Use summer, winter, etc. visuals if season is mentioned  
        - Output only the list of panels — no intro, no explanation, no closing

        Location: %s
        Main activity: %s
        Weather/Season: %s
        """.formatted(location, activity, weather);

        JSONObject json = new JSONObject()
                .put("model", "gpt-4o")
                .put("messages", new JSONArray()
                        .put(new JSONObject()
                                .put("role", "user")
                                .put("content", prompt)))
                .put("temperature", 0.7);

        Request request = new Request.Builder()
                .url(ENDPOINT)
                .header("Authorization", OPENAI_API_KEY)
                .post(RequestBody.create(json.toString(), MediaType.get("application/json")))
                .build();

        try (Response response = client.newCall(request).execute()) {
            JSONObject resJson = new JSONObject(response.body().string());
            return resJson.getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");
        }
    }
}

