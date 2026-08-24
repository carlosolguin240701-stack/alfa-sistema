package com.example.spring_boot.controller;

import com.example.spring_boot.model.TipoVehiculo;
import com.example.spring_boot.repository.TipoVehiculoRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-vehiculo")
@CrossOrigin(origins = "http://localhost:5173")
public class TipoVehiculoController {

    private final TipoVehiculoRepository repository;

    public TipoVehiculoController(
            TipoVehiculoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<TipoVehiculo> obtenerTipos() {
        return repository.findAll();
    }
}