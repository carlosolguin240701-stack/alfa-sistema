package com.example.spring_boot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String inicio() {
        return "¡Hola Carlos! Tu API con Spring Boot y Docker está funcionando correctamente 🚀";
    }

}