package com.aicontact.backend.comic.service;

import com.aicontact.backend.comic.dto.response.ComicResponseDto;
import com.aicontact.backend.comic.entity.ComicEntity;
import com.aicontact.backend.comic.repository.ComicRepository;
import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.couple.repository.CoupleRepository;
import com.aicontact.backend.global.storage.S3StorageService;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import okhttp3.*;
import org.jcodec.api.JCodecException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class DalleService {

    @Value("${GMS_KEY}")
    private String OPENAI_API_KEY;

    @Value("${DALLE_ENDPOINT}")
    private String ENDPOINT;

    @Autowired
    private S3StorageService s3StorageService;
    @Autowired
    private CoupleRepository coupleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ComicRepository comicRepository;


    public String generateImage(String prompt) throws IOException {
        OkHttpClient client = new OkHttpClient.Builder()
                .readTimeout(60, TimeUnit.SECONDS)
                .build();

        JSONObject json = new JSONObject()
                .put("model", "dall-e-3")
                .put("prompt", prompt)
                .put("n", 1)
                .put("size", "1024x1024")
                .put("response_format", "url");

        Request request = new Request.Builder()
                .url(ENDPOINT)
                .header("Authorization", OPENAI_API_KEY)
                .post(RequestBody.create(json.toString(), MediaType.get("application/json")))
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "(empty)";
                throw new IOException("GMS image API failed: " + response + "\n" + errorBody);
            }

            JSONObject resJson = new JSONObject(response.body().string());
            return resJson.getJSONArray("data").getJSONObject(0).getString("url");
        }
    }

    @Transactional
    public ComicResponseDto uploadDalleImageToS3(String dalleImageUrl, Long coupleId, Long uploaderId)
            throws IOException, JCodecException {

        // 1. 이미지 다운로드
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder().url(dalleImageUrl).build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful() || response.body() == null) {
                throw new IOException("DALL·E 이미지 다운로드 실패: " + response);
            }

            byte[] imageBytes = response.body().bytes();
            String contentType = response.header("Content-Type", "image/png");

            String extension = switch (contentType) {
                case "image/jpeg" -> "jpg";
                case "image/webp" -> "webp";
                case "image/png" -> "png";
                default -> "bin";
            };

            // 2. S3에 업로드
            String uuid = UUID.randomUUID().toString();
            String key = String.format("media/couple/%d/%s.%s", coupleId, uuid, extension);
            String fileUrl = s3StorageService.upload(imageBytes, key, contentType);

            // 3. DB 저장
            CoupleEntity couple = coupleRepository.getReferenceById(coupleId);
            UserEntity uploader = userRepository.getReferenceById(uploaderId);

            ComicEntity entity = ComicEntity.builder()
                    .couple(couple)
                    .creator(uploader)
                    .comicImageUrl(fileUrl)
                    .s3Key(key)
                    .title(null) // 프론트에서 제목 입력받는다면 파라미터로 추가
                    .createdAt(LocalDateTime.now())
                    .build();

            comicRepository.save(entity);

// DTO 반환 시 DTO도 새로 만들거나 entity.getId(), fileUrl 등 반환


            return ComicResponseDto.fromEntity(entity);
        }
    }



}


