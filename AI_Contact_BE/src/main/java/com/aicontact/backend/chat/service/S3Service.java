package com.aicontact.backend.chat.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * MultipartFile 을 S3에 업로드하고, 퍼블릭 URL을 반환합니다.
     */
    public String uploadImage(MultipartFile file) throws IOException {
        // 확장자 추출
        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
        }

        // 키 생성 (폴더/UUID.ext)
        String key = "chat-images/" + UUID.randomUUID() + ext;

        // 메타데이터 설정
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        // S3에 업로드 (퍼블릭 읽기 권한)
        PutObjectRequest request = new PutObjectRequest(bucket, key, file.getInputStream(), metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead);
        s3Client.putObject(request);

        // 업로드된 객체의 URL 반환
        return s3Client.getUrl(bucket, key).toString();
    }
}
