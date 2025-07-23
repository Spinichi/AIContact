package com.aicontact.backend.global.storage;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class S3StorageService implements StorageService {

    private final AmazonS3Client s3Client;
    private final String bucketName = System.getProperty("cloud.aws.s3.bucket");
    // 또는 @Value("${cloud.aws.s3.bucket}") 주입

    @Override
    public String upload(MultipartFile file, String key) throws IOException {
        ObjectMetadata meta = new ObjectMetadata();
        meta.setContentType(file.getContentType());
        meta.setContentLength(file.getSize());

        s3Client.putObject(bucketName, key, file.getInputStream(), meta);
        return s3Client.getUrl(bucketName, key).toString();
    }

    @Override
    public String generateThumbnailAndUpload(MultipartFile file, String thumbKey) throws IOException {
        // 1) 원본 이미지를 Thumbnails로 리사이징
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        Thumbnails.of(file.getInputStream())
                .size(200, 200)
                .outputFormat("jpg")
                .toOutputStream(os);

        byte[] thumbBytes = os.toByteArray();
        ByteArrayInputStream thumbInput = new ByteArrayInputStream(thumbBytes);

        // 2) 메타데이터 세팅
        ObjectMetadata meta = new ObjectMetadata();
        meta.setContentType("image/jpeg");
        meta.setContentLength(thumbBytes.length);

        // 3) S3 업로드
        s3Client.putObject(bucketName, thumbKey, thumbInput, meta);
        return s3Client.getUrl(bucketName, thumbKey).toString();
    }

    @Override
    public void delete(String key) {
        s3Client.deleteObject(bucketName, key);
    }
}
