package com.example.spring_boot.controller;

import com.example.spring_boot.model.Cita;
import com.example.spring_boot.repository.CitaRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "http://localhost:5173")
public class CitaController {

    private final CitaRepository citaRepository;

    public CitaController(
            CitaRepository citaRepository) {
        this.citaRepository = citaRepository;
    }

    @GetMapping
    public List<Cita> obtenerCitas() {
        return citaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cita> obtenerCitaPorId(
            @PathVariable Integer id) {

        return citaRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity
                                .notFound()
                                .build()
                );
    }

    @PostMapping
    public Cita registrarCita(
            @RequestBody Cita cita) {

        cita.setIdCita(null);

        if (cita.getEstatus() == null ||
            cita.getEstatus().isBlank()) {

            cita.setEstatus("Pendiente");
        }

        return citaRepository.save(cita);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cita> editarCita(
            @PathVariable Integer id,
            @RequestBody Cita datos) {

        return citaRepository
                .findById(id)
                .map(cita -> {

                    cita.setIdCliente(
                            datos.getIdCliente()
                    );

                    cita.setIdVehiculo(
                            datos.getIdVehiculo()
                    );

                    cita.setFecha(
                            datos.getFecha()
                    );

                    cita.setHora(
                            datos.getHora()
                    );

                    cita.setEstatus(
                            datos.getEstatus()
                    );

                    cita.setObservaciones(
                            datos.getObservaciones()
                    );

                    Cita actualizada =
                            citaRepository.save(cita);

                    return ResponseEntity.ok(
                            actualizada
                    );
                })
                .orElseGet(
                        () -> ResponseEntity
                                .notFound()
                                .build()
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCita(
            @PathVariable Integer id) {

        if (!citaRepository.existsById(id)) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        citaRepository.deleteById(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}