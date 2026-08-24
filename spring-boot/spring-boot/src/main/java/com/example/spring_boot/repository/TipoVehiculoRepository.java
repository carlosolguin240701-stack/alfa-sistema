package com.example.spring_boot.repository;

import com.example.spring_boot.model.TipoVehiculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipoVehiculoRepository
        extends JpaRepository<TipoVehiculo, Integer> {
}