package com.aicontact.backend.comicStrips.service;

import com.aicontact.backend.comicStrips.entity.ComicStripsEntity;
import com.aicontact.backend.comicStrips.repository.ComicStripsRepository;
import com.aicontact.backend.comic.service.GptScenarioService;
import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.couple.repository.CoupleRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Transactional
@RequiredArgsConstructor
public class ComicStripsService {

    private final ComicStripsRepository comicStripsRepo;
    private final CoupleRepository coupleRepo;
    private final GptScenarioService gptScenarioService;
    private final ImagenService imagenService;

    public ComicStripsEntity getMyComicStrips(Long coupleId) {
        return comicStripsRepo.findByCoupleId(coupleId)
                .orElseThrow(() -> new EntityNotFoundException("네컷만화 정보가 없습니다. coupleId=" + coupleId));
    }

    @Transactional
    public ComicStripsEntity createComicStrips(Long coupleId, String name) throws IOException {
        CoupleEntity couple = coupleRepo.findById(coupleId)
                .orElseThrow(() -> new EntityNotFoundException("Couple not found: " + coupleId));
        ComicStripsEntity comicStrips = new ComicStripsEntity();
        comicStrips.setCouple(couple);
        comicStrips.setName(name);

        // 1. 사진 외모 특성 추출하기
        String url1 = couple.getUser1().getProfileImageUrl();
        String url2 = couple.getUser2().getProfileImageUrl();

        String attributes = gptScenarioService.getAppearanceAttributes(url1,url2);
        String imageUrl = imagenService.uploadComicStripsImageToS3(attributes,coupleId);
        comicStrips.setImageUrl(imageUrl);
        return comicStripsRepo.save(comicStrips);
    }

    public ComicStripsEntity getComicStrips(Long id) {
        return comicStripsRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("AiComicStrips not found: " + id));
    }

    @Transactional
    public ComicStripsEntity updateComicStrips(Long id, String name, String imageUrl, Integer growthLevel, Integer experiencePoints) {
        ComicStripsEntity comicStrips = comicStripsRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("AiComicStrips not found: " + id));
        if (name != null)                comicStrips.setName(name);
        if (imageUrl != null)            comicStrips.setImageUrl(imageUrl);
        if (growthLevel != null)         comicStrips.setGrowthLevel(growthLevel);
        if (experiencePoints != null)    comicStrips.setExperiencePoints(experiencePoints);
        return comicStripsRepo.save(comicStrips);
    }

    @Transactional
    public void deleteComicStrips(Long id) {
        if (!comicStripsRepo.existsById(id)) {
            throw new EntityNotFoundException("ComicStrips not found: " + id);
        }
        comicStripsRepo.deleteById(id);
    }
}
