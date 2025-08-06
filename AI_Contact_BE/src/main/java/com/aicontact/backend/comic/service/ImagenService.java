package com.aicontact.backend.comic.service;

import com.aicontact.backend.aiChild.dto.AiChildImage;
import com.aicontact.backend.comic.repository.ComicRepository;
import com.aicontact.backend.couple.repository.CoupleRepository;
import com.aicontact.backend.global.storage.S3StorageService;
import com.aicontact.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class ImagenService {

    @Value("${GMS_KEY}")
    private String OPENAI_API_KEY;

    @Value("${IMAGEN_ENDPOINT}")
    private String ENDPOINT;

    @Autowired
    private S3StorageService s3StorageService;
    @Autowired
    private CoupleRepository coupleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ComicRepository comicRepository;


    public AiChildImage generateImage(String attributes) throws IOException {
        OkHttpClient client = new OkHttpClient.Builder()
                .readTimeout(60, TimeUnit.SECONDS)
                .build();

        String prompt = "Create a single full-body toddler (age 1–2) in a Disney/Pixar-inspired 3D animation style with the warmth of Studio Ghibli, stylized and non-photorealistic. Generate the child of two people with " + attributes + "The child has a slightly large head (about 1:2 head-to-body), soft cheeks on an oval-to-heart-shaped face, and neutral-light skin with a peach-gold undertone. Hair is medium-length, lightly wavy with chunky sculpted clumps and naturally blended dark-brown and honey-blonde highlights. Outfit is a simple cream onesie. Pose is centered, full body, facing the camera with a relaxed happy expression and arms at sides, with generous padding to avoid any crop. Render with toon/cel shading using 2–3 tone bands, matte materials, diffuse soft studio lighting, subtle ambient occlusion, high roughness, very low specular, pastel palette, no subsurface scattering, film grain, rim light, bloom, or depth-of-field. Eyes should have a single round catchlight each and a simple iris gradient. Use a plain white background. Constraints: one child only; no adults, props, split face, side-by-side, text, or watermark; keep everything cute, simple, and wholesome.";

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
            return new AiChildImage(imageBytes, mimeType);
        }
    }

    // 3) 디코딩된 바이트와 mimeType을 S3에 업로드하고 DB에 저장
    @Transactional
    public String uploadAiChildImageToS3(
            String attributes,
            Long coupleId
    ) throws IOException {
        // 이미지 생성 + 디코딩
        AiChildImage child = generateImage(attributes);
        byte[] imageBytes = child.getData();
        String contentType = child.getMimeType();

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

