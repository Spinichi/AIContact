package com.aicontact.backend.comicStrips.entity;

import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "comic_strips")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ComicStripsEntity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // couples 테이블의 id를 외래키로 매핑
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "couple_id", nullable = false, foreignKey = @ForeignKey(name = "fk_comic_strips_couple"))
    private CoupleEntity couple;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(length = 100)
    private String title;
}