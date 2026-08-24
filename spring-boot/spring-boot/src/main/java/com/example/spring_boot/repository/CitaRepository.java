package com.example.spring_boot.repository;

import com.example.spring_boot.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface CitaRepository
        extends JpaRepository<Cita, Integer> {

    long countByFecha(LocalDate fecha);

    List<Cita> findByFechaOrderByHoraAsc(LocalDate fecha);
}