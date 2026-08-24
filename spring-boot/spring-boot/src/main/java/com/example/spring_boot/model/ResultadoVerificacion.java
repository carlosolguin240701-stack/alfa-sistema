package com.example.spring_boot.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "resultados_verificacion")
public class ResultadoVerificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado")
    private Integer idResultado;

    @Column(name = "id_verificacion")
    private Integer idVerificacion;

    @Column(name = "resultado")
    private String resultado;

    @Column(name = "motivo_rechazo")
    private String motivoRechazo;

    @Column(name = "fecha_resultado")
    private LocalDateTime fechaResultado;

    public ResultadoVerificacion() {
    }

    public Integer getIdResultado() {
        return idResultado;
    }

    public void setIdResultado(Integer idResultado) {
        this.idResultado = idResultado;
    }

    public Integer getIdVerificacion() {
        return idVerificacion;
    }

    public void setIdVerificacion(Integer idVerificacion) {
        this.idVerificacion = idVerificacion;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public String getMotivoRechazo() {
        return motivoRechazo;
    }

    public void setMotivoRechazo(String motivoRechazo) {
        this.motivoRechazo = motivoRechazo;
    }

    public LocalDateTime getFechaResultado() {
        return fechaResultado;
    }

    public void setFechaResultado(LocalDateTime fechaResultado) {
        this.fechaResultado = fechaResultado;
    }
}