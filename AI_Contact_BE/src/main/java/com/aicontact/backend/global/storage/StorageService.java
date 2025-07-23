package com.aicontact.backend.global.storage;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface StorageService {
    /**
     * 원본 파일을 S3에 업로드하고, 업로드된 URL을 반환합니다.
     * @param file   업로드할 MultipartFile
     * @param key    S3에 저장할 객체 키 (예: "media/2025/07/abc123.jpg")
     * @return       S3에서 접근 가능한 파일 URL
     */
    String upload(MultipartFile file, String key) throws IOException;

    /**
     * 썸네일을 생성하여 S3에 업로드하고, URL을 반환합니다.
     * @param file     원본 MultipartFile
     * @param thumbKey S3에 저장할 썸네일 객체 키 (예: "media/2025/07/abc123_thumb.jpg")
     * @return         S3에서 접근 가능한 썸네일 URL
     */
    String generateThumbnailAndUpload(MultipartFile file, String thumbKey) throws IOException;

    /**
     * S3에 저장된 객체를 삭제합니다.
     * @param key S3 객체 키
     */
    void delete(String key);
}
