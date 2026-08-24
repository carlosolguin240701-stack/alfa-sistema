package com.example.spring_boot.controller;

import com.example.spring_boot.model.Cita;
import com.example.spring_boot.model.ResultadoVerificacion;
import com.example.spring_boot.model.Verificacion;

import com.example.spring_boot.repository.CitaRepository;
import com.example.spring_boot.repository.ResultadoVerificacionRepository;
import com.example.spring_boot.repository.VerificacionRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/verificaciones")
@CrossOrigin(origins = "http://localhost:5173")
public class VerificacionController {

    private final VerificacionRepository verificacionRepository;
    private final ResultadoVerificacionRepository resultadoRepository;
    private final CitaRepository citaRepository;

    public VerificacionController(
            VerificacionRepository verificacionRepository,
            ResultadoVerificacionRepository resultadoRepository,
            CitaRepository citaRepository) {

        this.verificacionRepository =
                verificacionRepository;

        this.resultadoRepository =
                resultadoRepository;

        this.citaRepository =
                citaRepository;
    }

    // ======================================================
    // CONSULTAR TODAS
    // ======================================================

    @GetMapping
    public List<Verificacion> obtenerVerificaciones() {

        return verificacionRepository.findAll();
    }

    // ======================================================
    // REGISTRAR RESULTADO / NUEVO INTENTO
    // ======================================================

    @PostMapping("/resultado")
    public ResponseEntity<?> registrarResultado(
            @RequestBody Map<String, Object> datos) {

        try {

            Integer idCita =
                    Integer.valueOf(
                            datos.get("idCita").toString()
                    );

            String resultado =
                    datos.get("resultado")
                            .toString();

            String observaciones =
                    datos.get("observaciones") != null
                            ? datos.get("observaciones").toString()
                            : "";

            if (
                !resultado.equals("Aprobado") &&
                !resultado.equals("Rechazado")
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            Map.of(
                                "mensaje",
                                "Resultado no válido"
                            )
                        );
            }

            Cita cita =
                    citaRepository
                            .findById(idCita)
                            .orElse(null);

            if (cita == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            // ==============================================
            // CONTAR INTENTOS DEL VEHÍCULO
            // ==============================================

            long intentosAnteriores =
                    verificacionRepository
                            .contarIntentosPorVehiculo(
                                    cita.getIdVehiculo()
                            );

            int numeroIntento =
                    (int) intentosAnteriores + 1;

            // ==============================================
            // CREAR VERIFICACIÓN
            // ==============================================

            Verificacion verificacion =
                    new Verificacion();

            verificacion.setIdCita(
                    cita.getIdCita()
            );

            // Valores internos.
            // No se muestran en React.
            verificacion.setIdLinea(1);
            verificacion.setIdTecnico(1);

            String fechaFolio =
                    LocalDateTime
                            .now()
                            .format(
                                DateTimeFormatter.ofPattern(
                                    "yyyyMMddHHmmss"
                                )
                            );

            String codigo =
                    UUID.randomUUID()
                            .toString()
                            .substring(0, 4)
                            .toUpperCase();

            verificacion.setFolio(
                    "ALFA-" +
                    fechaFolio +
                    "-" +
                    codigo
            );

            verificacion.setFechaInicio(
                    LocalDateTime.now()
            );

            verificacion.setFechaFin(
                    LocalDateTime.now()
            );

            if (intentosAnteriores == 0) {

                verificacion.setTipoVerificacion(
                        "Primera"
                );

            } else {

                verificacion.setTipoVerificacion(
                        "Reverificacion"
                );
            }

            if (resultado.equals("Aprobado")) {

                verificacion.setEstatus(
                        "Aprobada"
                );

            } else {

                verificacion.setEstatus(
                        "Rechazada"
                );
            }

            verificacion.setObservaciones(
                    observaciones
            );

            Verificacion guardada =
                    verificacionRepository
                            .save(verificacion);

            // ==============================================
            // GUARDAR RESULTADO
            // ==============================================

            ResultadoVerificacion resultadoBD =
                    new ResultadoVerificacion();

            resultadoBD.setIdVerificacion(
                    guardada.getIdVerificacion()
            );

            resultadoBD.setResultado(
                    resultado
            );

            if (resultado.equals("Rechazado")) {

                resultadoBD.setMotivoRechazo(
                        observaciones
                );

            } else {

                resultadoBD.setMotivoRechazo(
                        null
                );
            }

            resultadoBD.setFechaResultado(
                    LocalDateTime.now()
            );

            resultadoRepository.save(
                    resultadoBD
            );

            // ==============================================
            // ACTUALIZAR CITA
            // ==============================================

            if (resultado.equals("Aprobado")) {

                cita.setEstatus(
                        "Finalizada"
                );

            } else {

                cita.setEstatus(
                        "Confirmada"
                );
            }

            citaRepository.save(cita);

            // ==============================================
            // RESPUESTA
            // ==============================================

            Map<String, Object> respuesta =
                    new HashMap<>();

            respuesta.put(
                    "mensaje",
                    "Resultado registrado correctamente"
            );

            respuesta.put(
                    "idVerificacion",
                    guardada.getIdVerificacion()
            );

            respuesta.put(
                    "folio",
                    guardada.getFolio()
            );

            respuesta.put(
                    "resultado",
                    resultado
            );

            respuesta.put(
                    "intento",
                    numeroIntento
            );

            respuesta.put(
                    "idVehiculo",
                    cita.getIdVehiculo()
            );

            return ResponseEntity.ok(
                    respuesta
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                        Map.of(
                            "mensaje",
                            "No fue posible registrar la verificación",
                            "detalle",
                            error.getMessage() != null
                                ? error.getMessage()
                                : "Error desconocido"
                        )
                    );
        }
    }
}