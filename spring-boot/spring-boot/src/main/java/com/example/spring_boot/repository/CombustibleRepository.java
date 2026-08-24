package com.example.spring_boot.repository;

import com.example.spring_boot.model.Combustible;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CombustibleRepository
        extends JpaRepository<Combustible, Integer> {
}