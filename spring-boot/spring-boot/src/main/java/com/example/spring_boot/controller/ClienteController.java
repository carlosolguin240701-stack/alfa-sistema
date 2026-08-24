package com.example.spring_boot.controller;

import com.example.spring_boot.model.Cliente;
import com.example.spring_boot.repository.ClienteRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {

    private final ClienteRepository clienteRepository;

    public ClienteController(
            ClienteRepository clienteRepository) {

        this.clienteRepository = clienteRepository;
    }

    // ======================================================
    // CONSULTAR TODOS
    // ======================================================

    @GetMapping
    public List<Cliente> obtenerClientes() {

        return clienteRepository.findAll();
    }

    // ======================================================
    // CONSULTAR POR ID
    // ======================================================

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerClientePorId(
            @PathVariable Integer id) {

        return clienteRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // ======================================================
    // CREAR
    // ======================================================

    @PostMapping
    public Cliente registrarCliente(
            @RequestBody Cliente cliente) {

        cliente.setIdCliente(null);

        if (cliente.getActivo() == null) {
            cliente.setActivo(true);
        }

        return clienteRepository.save(cliente);
    }

    // ======================================================
    // EDITAR
    // ======================================================

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> editarCliente(
            @PathVariable Integer id,
            @RequestBody Cliente datos) {

        return clienteRepository
                .findById(id)
                .map(cliente -> {

                    cliente.setNombre(
                            datos.getNombre()
                    );

                    cliente.setApellidoPaterno(
                            datos.getApellidoPaterno()
                    );

                    cliente.setApellidoMaterno(
                            datos.getApellidoMaterno()
                    );

                    cliente.setTelefono(
                            datos.getTelefono()
                    );

                    cliente.setCorreo(
                            datos.getCorreo()
                    );

                    cliente.setDireccion(
                            datos.getDireccion()
                    );

                    cliente.setIdMunicipio(
                            datos.getIdMunicipio()
                    );

                    cliente.setActivo(
                            datos.getActivo()
                    );

                    Cliente actualizado =
                            clienteRepository.save(
                                    cliente
                            );

                    return ResponseEntity.ok(
                            actualizado
                    );
                })
                .orElseGet(
                        () -> ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // ======================================================
    // ELIMINAR
    // ======================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(
            @PathVariable Integer id) {

        if (!clienteRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        clienteRepository.deleteById(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}