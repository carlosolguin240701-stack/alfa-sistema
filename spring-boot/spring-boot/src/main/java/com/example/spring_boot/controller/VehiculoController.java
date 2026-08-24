package com.example.spring_boot.controller;

import com.example.spring_boot.model.Vehiculo;
import com.example.spring_boot.repository.VehiculoRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehiculos")
@CrossOrigin(origins = "http://localhost:5173")
public class VehiculoController {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoController(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    // ======================================================
    // GET - CONSULTAR TODOS
    // ======================================================

    @GetMapping
    public List<Vehiculo> obtenerVehiculos() {
        return vehiculoRepository.findAll();
    }

    // ======================================================
    // GET - CONSULTAR POR ID
    // ======================================================

    @GetMapping("/{id}")
    public ResponseEntity<Vehiculo> obtenerVehiculoPorId(
            @PathVariable Integer id) {

        Optional<Vehiculo> vehiculo =
                vehiculoRepository.findById(id);

        return vehiculo
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // ======================================================
    // POST - AGREGAR
    // ======================================================

    @PostMapping
    public Vehiculo agregarVehiculo(
            @RequestBody Vehiculo vehiculo) {

        vehiculo.setIdVehiculo(null);

        return vehiculoRepository.save(vehiculo);
    }

    // ======================================================
    // PUT - EDITAR
    // ======================================================

    @PutMapping("/{id}")
    public ResponseEntity<Vehiculo> editarVehiculo(
            @PathVariable Integer id,
            @RequestBody Vehiculo datos) {

        Optional<Vehiculo> vehiculoExistente =
                vehiculoRepository.findById(id);

        if (vehiculoExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Vehiculo vehiculo = vehiculoExistente.get();

        vehiculo.setIdCliente(datos.getIdCliente());
        vehiculo.setIdModelo(datos.getIdModelo());
        vehiculo.setIdTipo(datos.getIdTipo());
        vehiculo.setIdCombustible(datos.getIdCombustible());

        vehiculo.setPlacas(datos.getPlacas());
        vehiculo.setVin(datos.getVin());
        vehiculo.setNumeroMotor(datos.getNumeroMotor());

        vehiculo.setColor(datos.getColor());
        vehiculo.setAnio(datos.getAnio());

        vehiculo.setNumeroSerie(datos.getNumeroSerie());
        vehiculo.setKilometraje(datos.getKilometraje());

        vehiculo.setActivo(datos.getActivo());
        vehiculo.setModelo(datos.getModelo());

        Vehiculo actualizado =
                vehiculoRepository.save(vehiculo);

        return ResponseEntity.ok(actualizado);
    }

    // ======================================================
    // DELETE - ELIMINAR
    // ======================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVehiculo(
            @PathVariable Integer id) {

        if (!vehiculoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        vehiculoRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}