package com.example.spring_boot.repository;

import com.example.spring_boot.model.ResultadoVerificacion;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultadoVerificacionRepository
        extends JpaRepository<ResultadoVerificacion, Integer> {
}