package com.aicontact.backend.comic.service;

import com.aicontact.backend.comic.dto.response.ComicResponseDto;
import com.aicontact.backend.comic.repository.ComicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComicService {

    private final ComicRepository comicRepository;

    public List<ComicResponseDto> getComicsByCouple(Long coupleId) {
        return comicRepository.findAllByCoupleIdOrderByCreatedAtDesc(coupleId)
                .stream()
                .map(ComicResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}

