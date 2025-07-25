package com.aicontact.backend.couple.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table(name = "couples")
public class CoupleEntity {
    @Id
    private Long id;
}
