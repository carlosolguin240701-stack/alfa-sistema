package com.example.spring_boot.repository;

import com.example.spring_boot.model.Verificacion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VerificacionRepository
        extends JpaRepository<Verificacion, Integer> {

    long countByEstatus(String estatus);

    @Query(
        value = """
            SELECT COUNT(*)
            FROM verificaciones v
            INNER JOIN citas c
                ON c.id_cita = v.id_cita
            WHERE c.id_vehiculo = :idVehiculo
            """,
        nativeQuery = true
    )
    long contarIntentosPorVehiculo(
            @Param("idVehiculo") Integer idVehiculo
    );
}