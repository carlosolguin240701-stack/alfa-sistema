package com.example.spring_boot.controller;

import com.example.spring_boot.model.Modelo;
import com.example.spring_boot.repository.ModeloRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modelos")
@CrossOrigin(origins = "http://localhost:5173")
public class ModeloController {

    private final ModeloRepository modeloRepository;

    public ModeloController(ModeloRepository modeloRepository) {
        this.modeloRepository = modeloRepository;
    }

    @GetMapping
    public List<Modelo> obtenerModelos() {
        return modeloRepository.findAll();
    }
}