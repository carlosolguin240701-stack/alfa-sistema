package com.example.spring_boot.controller;

import com.example.spring_boot.repository.ClienteRepository;
import com.example.spring_boot.repository.VehiculoRepository;
import com.example.spring_boot.repository.CitaRepository;
import com.example.spring_boot.repository.VerificacionRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final ClienteRepository clienteRepository;
    private final VehiculoRepository vehiculoRepository;
    private final CitaRepository citaRepository;
    private final VerificacionRepository verificacionRepository;

    public DashboardController(
            ClienteRepository clienteRepository,
            VehiculoRepository vehiculoRepository,
            CitaRepository citaRepository,
            VerificacionRepository verificacionRepository) {

        this.clienteRepository = clienteRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.citaRepository = citaRepository;
        this.verificacionRepository = verificacionRepository;
    }

    @GetMapping("/resumen")
    public Map<String, Object> obtenerResumen() {

        Map<String, Object> resumen =
                new HashMap<>();

        // ==================================================
        // CLIENTES
        // ==================================================

        long clientes =
                clienteRepository.count();

        // ==================================================
        // VEHÍCULOS
        // ==================================================

        long vehiculos =
                vehiculoRepository.count();

        // ==================================================
        // CITAS DEL DÍA
        // ==================================================

        long citasHoy =
                citaRepository.countByFecha(
                        LocalDate.now()
                );

        // ==================================================
        // VERIFICACIONES
        // ==================================================

        long totalVerificaciones =
                verificacionRepository.count();

        long aprobadas =
                verificacionRepository
                        .countByEstatus("Aprobada");

        long rechazadas =
                verificacionRepository
                        .countByEstatus("Rechazada");

        // ==================================================
        // PORCENTAJE DE APROBACIÓN
        // ==================================================

        double porcentajeAprobadas = 0;

        if (totalVerificaciones > 0) {

            porcentajeAprobadas =
                    (aprobadas * 100.0)
                            / totalVerificaciones;
        }

        // ==================================================
        // RESPUESTA
        // ==================================================

        resumen.put(
                "clientes",
                clientes
        );

        resumen.put(
                "vehiculos",
                vehiculos
        );

        resumen.put(
                "citasHoy",
                citasHoy
        );

        resumen.put(
                "intentos",
                totalVerificaciones
        );

        resumen.put(
                "aprobadas",
                aprobadas
        );

        resumen.put(
                "rechazadas",
                rechazadas
        );

        resumen.put(
                "porcentajeAprobadas",
                Math.round(
                        porcentajeAprobadas
                )
        );

        return resumen;
    }
}