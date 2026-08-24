package com.example.spring_boot.controller;

import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ConexionController {

    private final JdbcTemplate jdbcTemplate;

    public ConexionController(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @GetMapping("/conexion")
    public String conexion() {
        return "✅ Conexión exitosa entre React y Spring Boot";
    }

    @GetMapping("/conexion-db")
    public Map<String, Object> conexionBaseDatos() {

        Map<String, Object> respuesta = new HashMap<>();

        try {

            String baseDatos =
                    jdbcTemplate.queryForObject(
                            "SELECT DATABASE()",
                            String.class
                    );

            Integer totalTablas =
                    jdbcTemplate.queryForObject(
                            """
                            SELECT COUNT(*)
                            FROM information_schema.tables
                            WHERE table_schema = DATABASE()
                            """,
                            Integer.class
                    );

            respuesta.put("estado", "OK");
            respuesta.put("mensaje", "Conexión completa exitosa");
            respuesta.put("backend", "Spring Boot");
            respuesta.put("baseDatos", baseDatos);
            respuesta.put("motor", "MySQL");
            respuesta.put("totalTablas", totalTablas);

        } catch (Exception e) {

            respuesta.put("estado", "ERROR");
            respuesta.put(
                    "mensaje",
                    "No se pudo consultar la base de datos"
            );
            respuesta.put("detalle", e.getMessage());
        }

        return respuesta;
    }
}