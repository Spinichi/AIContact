package com.aicontact.backend.comicStrips.service;

import java.io.IOException;
import java.util.Base64;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.aicontact.backend.comicStrips.dto.ComicStripsImage;
import com.aicontact.backend.global.storage.S3StorageService;

import jakarta.transaction.Transactional;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class ImagenService {

    @Value("${GMS_KEY}")
    private String OPENAI_API_KEY;

    @Value("${IMAGEN_ENDPOINT}")
    private String ENDPOINT;

    @Autowired
    private S3StorageService s3StorageService;

    public ComicStripsImage generateImage(String location, String activity, String weather) throws IOException {
        OkHttpClient client = new OkHttpClient.Builder()
                .readTimeout(60, TimeUnit.SECONDS)
                .build();

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

        JSONObject payload = new JSONObject()
                .put("instances", new JSONArray()
                        .put(new JSONObject().put("prompt", prompt))
                )
                .put("parameters", new JSONObject()
                        .put("sampleCount", 1)
                );

        Request request = new Request.Builder()
                .url(ENDPOINT + OPENAI_API_KEY.substring(7))
                .post(RequestBody.create(
                        payload.toString(),
                        MediaType.get("application/json")))
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful() || response.body() == null) {
                String err = response.body() != null
                        ? response.body().string()
                        : "(empty)";
                throw new IOException("Image API failed: "
                        + response.code() + " / " + err);
            }

            JSONObject resJson = new JSONObject(response.body().string());
            JSONObject pred = resJson
                    .getJSONArray("predictions")
                    .getJSONObject(0);

            String base64 = pred.getString("bytesBase64Encoded");
            String mimeType = pred.getString("mimeType");

            byte[] imageBytes = Base64.getDecoder().decode(base64);
            return new ComicStripsImage(imageBytes, mimeType);
        }
    }

    // 디코딩된 바이트와 mimeType을 S3에 업로드하고 DB에 저장
    @Transactional
    public String uploadComicStripsImageToS3(
            String attributes,
            Long coupleId
    ) throws IOException {
        // 이미지 생성 + 디코딩
        ComicStripsImage comicStrips = generateImage(attributes);
        byte[] imageBytes = comicStrips.getData();
        String contentType = comicStrips.getMimeType();

        // 확장자 결정
        String extension = switch (contentType) {
            case "image/jpeg" -> "jpg";
            case "image/webp" -> "webp";
            case "image/png"  -> "png";
            default            -> "bin";
        };

        // S3 키, 업로드
        String uuid = UUID.randomUUID().toString();
        String key  = String.format("media/couple/%d/%s.%s",
                coupleId, uuid, extension);

        return s3StorageService.upload(imageBytes, key, contentType);
    }

}

