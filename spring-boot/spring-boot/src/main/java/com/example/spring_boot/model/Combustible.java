package com.example.spring_boot.model;

import jakarta.persistence.*;

@Entity
@Table(name = "combustibles")
public class Combustible {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_combustible")
    private Integer idCombustible;

    @Column(name = "nombre")
    private String nombre;

    public Combustible() {}

    public Integer getIdCombustible() {
        return idCombustible;
    }

    public void setIdCombustible(Integer idCombustible) {
        this.idCombustible = idCombustible;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}