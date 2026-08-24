import { useEffect, useState } from "react";
import "../styles/Clients.css";

// ClientsTable.jsx
import API_URL from "../config/api";

const API = `${API_URL}/api/clientes`;

const clienteInicial = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  telefono: "",
  correo: "",
  direccion: "",
  idMunicipio: "",
  activo: true
};

function ClientsTable() {
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState(clienteInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // ======================================================
  // CARGAR EMPLEADOS
  // ======================================================

  const cargarClientes = async () => {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(API);

      if (!respuesta.ok) {
        throw new Error(
          "No fue posible consultar los empleados"
        );
      }

      const datos = await respuesta.json();
      setClientes(datos);

    } catch (err) {
      console.error(err);

      setError(
        "❌ Error al cargar los empleados"
      );

    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // ======================================================
  // INPUTS
  // ======================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setFormulario({
      ...formulario,
      [name]:
        type === "checkbox"
          ? checked
          : value
    });
  };

  // ======================================================
  // GUARDAR / ACTUALIZAR
  // ======================================================

  const guardarCliente = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    const cliente = {
      nombre:
        formulario.nombre.trim(),

      apellidoPaterno:
        formulario.apellidoPaterno.trim(),

      apellidoMaterno:
        formulario.apellidoMaterno.trim(),

      telefono:
        formulario.telefono.trim(),

      correo:
        formulario.correo.trim(),

      direccion:
        formulario.direccion.trim(),

      idMunicipio:
        formulario.idMunicipio !== ""
          ? Number(formulario.idMunicipio)
          : null,

      activo:
        formulario.activo
    };

    try {
      let respuesta;

      if (editandoId !== null) {
        respuesta = await fetch(
          `${API}/${editandoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
          }
        );

      } else {
        respuesta = await fetch(
          API,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
          }
        );
      }

      if (!respuesta.ok) {
        const texto =
          await respuesta.text();

        throw new Error(
          texto ||
          "No fue posible guardar el empleado"
        );
      }

      setMensaje(
        editandoId !== null
          ? "✅ Empleado actualizado correctamente"
          : "✅ Empleado registrado correctamente"
      );

      cancelarEdicion();

      await cargarClientes();

    } catch (err) {
      console.error(err);

      setError(
        `❌ ${err.message}`
      );
    }
  };

  // ======================================================
  // PREPARAR EDICIÓN
  // ======================================================

  const prepararEdicion = (cliente) => {
    setEditandoId(cliente.idCliente);

    setFormulario({
      nombre:
        cliente.nombre ?? "",

      apellidoPaterno:
        cliente.apellidoPaterno ?? "",

      apellidoMaterno:
        cliente.apellidoMaterno ?? "",

      telefono:
        cliente.telefono ?? "",

      correo:
        cliente.correo ?? "",

      direccion:
        cliente.direccion ?? "",

      idMunicipio:
        cliente.idMunicipio ?? "",

      activo:
        cliente.activo ?? true
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // ======================================================
  // CANCELAR EDICIÓN
  // ======================================================

  const cancelarEdicion = () => {
    setFormulario(clienteInicial);
    setEditandoId(null);
  };

  // ======================================================
  // DESACTIVAR EMPLEADO
  // ======================================================

  const desactivarCliente = async (cliente) => {
    const confirmar = window.confirm(
      `¿Deseas desactivar al empleado ${cliente.nombre} ${cliente.apellidoPaterno ?? ""}?`
    );

    if (!confirmar) {
      return;
    }

    setMensaje("");
    setError("");

    try {
      const actualizado = {
        nombre:
          cliente.nombre,

        apellidoPaterno:
          cliente.apellidoPaterno,

        apellidoMaterno:
          cliente.apellidoMaterno,

        telefono:
          cliente.telefono,

        correo:
          cliente.correo,

        direccion:
          cliente.direccion,

        idMunicipio:
          cliente.idMunicipio,

        activo:
          false
      };

      const respuesta = await fetch(
        `${API}/${cliente.idCliente}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(actualizado)
        }
      );

      if (!respuesta.ok) {
        throw new Error(
          "No fue posible desactivar el empleado"
        );
      }

      setMensaje(
        "✅ Empleado desactivado correctamente"
      );

      await cargarClientes();

    } catch (error) {
      console.error(error);

      setError(
        "❌ No fue posible desactivar el empleado"
      );
    }
  };

  // ======================================================
  // SOLO EMPLEADOS ACTIVOS
  // ======================================================

  const clientesActivos =
    clientes.filter(
      (cliente) =>
        cliente.activo === true
    );

  // ======================================================
  // INTERFAZ
  // ======================================================

  return (
    <section className="clients-section">

      <div className="clients-header">

        <div>

          <h2>
            👥 Administración de Empleados
          </h2>

          <p>
            Registro y administración de empleados.
          </p>

        </div>

        <button
          type="button"
          className="clients-refresh"
          onClick={cargarClientes}
        >
          🔄 Actualizar
        </button>

      </div>

      <form
        className="clients-form"
        onSubmit={guardarCliente}
      >

        <h3>
          {editandoId !== null
            ? "✏️ Editar empleado"
            : "➕ Registrar empleado"}
        </h3>

        <div className="clients-grid">

          <input
            name="nombre"
            placeholder="Nombre"
            value={formulario.nombre}
            onChange={handleChange}
            required
          />

          <input
            name="apellidoPaterno"
            placeholder="Apellido paterno"
            value={formulario.apellidoPaterno}
            onChange={handleChange}
            required
          />

          <input
            name="apellidoMaterno"
            placeholder="Apellido materno"
            value={formulario.apellidoMaterno}
            onChange={handleChange}
          />

          <input
            name="telefono"
            placeholder="Teléfono"
            value={formulario.telefono}
            onChange={handleChange}
          />

          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formulario.correo}
            onChange={handleChange}
          />

          <input
            name="direccion"
            placeholder="Dirección"
            value={formulario.direccion}
            onChange={handleChange}
          />

          <input
            type="number"
            name="idMunicipio"
            placeholder="ID Municipio"
            value={formulario.idMunicipio}
            onChange={handleChange}
          />

        </div>

        <label className="client-active">

          <input
            type="checkbox"
            name="activo"
            checked={formulario.activo}
            onChange={handleChange}
          />

          Empleado activo

        </label>

        <div className="clients-form-actions">

          <button
            type="submit"
            className="client-save"
          >
            {editandoId !== null
              ? "💾 Guardar cambios"
              : "➕ Registrar empleado"}
          </button>

          {editandoId !== null && (

            <button
              type="button"
              className="client-cancel"
              onClick={cancelarEdicion}
            >
              Cancelar
            </button>

          )}

        </div>

      </form>

      {mensaje && (
        <div className="clients-success">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="clients-error">
          {error}
        </div>
      )}

      {cargando && (
        <div className="clients-loading">
          Cargando empleados...
        </div>
      )}

      {!cargando && (

        <div className="clients-table-container">

          <table className="clients-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Nombre completo</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {clientesActivos.map(
                (cliente) => (

                  <tr
                    key={
                      cliente.idCliente
                    }
                  >

                    <td>
                      {cliente.idCliente}
                    </td>

                    <td>
                      {cliente.nombre}{" "}
                      {cliente.apellidoPaterno}{" "}
                      {cliente.apellidoMaterno}
                    </td>

                    <td>
                      {cliente.telefono || "-"}
                    </td>

                    <td>
                      {cliente.correo || "-"}
                    </td>

                    <td>
                      {cliente.direccion || "-"}
                    </td>

                    <td>

                      <div className="clients-actions">

                        <button
                          type="button"
                          className="client-edit"
                          title="Editar empleado"
                          onClick={() =>
                            prepararEdicion(cliente)
                          }
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          className="client-delete"
                          title="Desactivar empleado"
                          onClick={() =>
                            desactivarCliente(cliente)
                          }
                        >
                          🚫
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {clientesActivos.length === 0 && (

            <div className="clients-loading">
              No hay empleados activos registrados.
            </div>

          )}

        </div>

      )}

    </section>
  );
}

export default ClientsTable;