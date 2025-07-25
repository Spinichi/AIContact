package com.aicontact.backend.couple.entity.repository;
import com.aicontact.backend.couple.entity.CoupleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoupleRepository extends JpaRepository<CoupleEntity, Long> {
    // getReferenceById 메서드를 쓰려면 JpaRepository만으로 충분합니다.
}
