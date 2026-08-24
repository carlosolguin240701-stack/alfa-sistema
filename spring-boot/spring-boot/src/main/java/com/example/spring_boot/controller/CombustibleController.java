package com.example.spring_boot.controller;

import com.example.spring_boot.model.Combustible;
import com.example.spring_boot.repository.CombustibleRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/combustibles")
@CrossOrigin(origins = "http://localhost:5173")
public class CombustibleController {

    private final CombustibleRepository repository;

    public CombustibleController(
            CombustibleRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Combustible> obtenerCombustibles() {
        return repository.findAll();
    }
}