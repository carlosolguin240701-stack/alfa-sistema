package com.example.spring_boot.repository;

import com.example.spring_boot.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository
        extends JpaRepository<Cliente, Integer> {
}