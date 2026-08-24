import { useEffect, useState } from "react";
import "../styles/Calendar.css";

// Calendar.jsx
import API_URL from "../config/api";

const API_CITAS = `${API_URL}/api/citas`;
const API_CLIENTES = `${API_URL}/api/clientes`;
const API_VEHICULOS = `${API_URL}/api/vehiculos`;

const citaInicial = {
  idCliente: "",
  idVehiculo: "",
  fecha: "",
  hora: "",
  estatus: "Pendiente",
  observaciones: ""
};

function Calendar() {

  const [citas, setCitas] =
    useState([]);

  const [clientes, setClientes] =
    useState([]);

  const [vehiculos, setVehiculos] =
    useState([]);

  const [formulario, setFormulario] =
    useState(citaInicial);

  const [editandoId, setEditandoId] =
    useState(null);

  const [mensaje, setMensaje] =
    useState("");

  const [error, setError] =
    useState("");

  const [cargando, setCargando] =
    useState(false);

  // ======================================================
  // CARGAR DATOS
  // ======================================================

  const cargarCitas = async () => {

    setCargando(true);

    try {

      const respuesta =
        await fetch(API_CITAS);

      if (!respuesta.ok) {

        throw new Error(
          "No fue posible cargar las citas"
        );
      }

      setCitas(
        await respuesta.json()
      );

    } catch (err) {

      console.error(err);

      setError(
        "❌ Error al obtener las citas"
      );

    } finally {

      setCargando(false);
    }
  };

  const cargarClientes = async () => {

    try {

      const respuesta =
        await fetch(API_CLIENTES);

      setClientes(
        await respuesta.json()
      );

    } catch (err) {

      console.error(err);
    }
  };

  const cargarVehiculos = async () => {

    try {

      const respuesta =
        await fetch(API_VEHICULOS);

      setVehiculos(
        await respuesta.json()
      );

    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {

    cargarCitas();
    cargarClientes();
    cargarVehiculos();

  }, []);

  // ======================================================
  // INPUTS
  // ======================================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  // ======================================================
  // ACTIVOS
  // ======================================================

  const clientesActivos =
    clientes.filter(
      (cliente) =>
        cliente.activo === true
    );

  const vehiculosCliente =
    formulario.idCliente
      ? vehiculos.filter(
          (vehiculo) =>
            String(
              vehiculo.idCliente
            ) ===
              String(
                formulario.idCliente
              ) &&
            vehiculo.activo === true
        )
      : [];

  // ======================================================
  // GUARDAR
  // ======================================================

  const guardarCita = async (
    event
  ) => {

    event.preventDefault();

    setMensaje("");
    setError("");

    const cita = {

      idCliente:
        Number(
          formulario.idCliente
        ),

      idVehiculo:
        Number(
          formulario.idVehiculo
        ),

      fecha:
        formulario.fecha,

      hora:
        formulario.hora,

      estatus:
        formulario.estatus,

      observaciones:
        formulario.observaciones
    };

    try {

      let respuesta;

      if (editandoId !== null) {

        respuesta =
          await fetch(
            `${API_CITAS}/${editandoId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(cita)
            }
          );

      } else {

        respuesta =
          await fetch(
            API_CITAS,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(cita)
            }
          );
      }

      if (!respuesta.ok) {

        throw new Error(
          "No fue posible guardar la cita"
        );
      }

      setMensaje(
        editandoId !== null
          ? "✅ Cita actualizada correctamente"
          : "✅ Cita registrada correctamente"
      );

      cancelarEdicion();

      await cargarCitas();

    } catch (err) {

      console.error(err);

      setError(
        `❌ ${err.message}`
      );
    }
  };

  // ======================================================
  // EDITAR
  // ======================================================

  const prepararEdicion = (
    cita
  ) => {

    setEditandoId(
      cita.idCita
    );

    setFormulario({

      idCliente:
        cita.idCliente ?? "",

      idVehiculo:
        cita.idVehiculo ?? "",

      fecha:
        cita.fecha ?? "",

      hora:
        cita.hora
          ? cita.hora.substring(0, 5)
          : "",

      estatus:
        cita.estatus ??
        "Pendiente",

      observaciones:
        cita.observaciones ?? ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const cancelarEdicion = () => {

    setFormulario(
      citaInicial
    );

    setEditandoId(null);
  };

  // ======================================================
  // ELIMINAR CITA
  // ======================================================

  const cancelarCita = async (cita) => {
  const confirmar = window.confirm(
    `¿Deseas cancelar la cita #${cita.idCita}?`
  );

  if (!confirmar) {
    return;
  }

  setMensaje("");
  setError("");

  try {
    const actualizada = {
      idCliente: cita.idCliente,
      idVehiculo: cita.idVehiculo,
      fecha: cita.fecha,
      hora: cita.hora,
      estatus: "Cancelada",
      observaciones:
        cita.observaciones || "Cita cancelada"
    };

    const respuesta = await fetch(
      `${API_CITAS}/${cita.idCita}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(actualizada)
      }
    );

    if (!respuesta.ok) {
      throw new Error(
        "No fue posible cancelar la cita"
      );
    }

    setMensaje(
      "✅ Cita cancelada correctamente"
    );

    await cargarCitas();

  } catch (error) {
    console.error(error);

    setError(
      "❌ No fue posible cancelar la cita"
    );
  }
};

  // ======================================================
  // NOMBRES
  // ======================================================

  const obtenerNombreCliente =
    (idCliente) => {

      const cliente =
        clientes.find(
          (cliente) =>
            cliente.idCliente ===
            idCliente
        );

      if (!cliente) {

        return "Cliente no disponible";
      }

      return `${cliente.nombre ?? ""} ${
        cliente.apellidoPaterno ?? ""
      } ${
        cliente.apellidoMaterno ?? ""
      }`.trim();
    };

  const obtenerVehiculo =
    (idVehiculo) => {

      const vehiculo =
        vehiculos.find(
          (vehiculo) =>
            vehiculo.idVehiculo ===
            idVehiculo
        );

      if (!vehiculo) {

        return "Vehículo no disponible";
      }

      return `${vehiculo.placas} - ${vehiculo.vin}`;
    };

  // ======================================================
  // INTERFAZ
  // ======================================================

  return (

    <section className="calendar-section">

      <div className="calendar-header">

        <div>

          <h2>
            📅 Administración de Citas
          </h2>

          <p>
            Agenda y administración
            de citas de servicio.
          </p>

        </div>

        <button
          type="button"
          className="calendar-refresh"
          onClick={cargarCitas}
        >
          🔄 Actualizar
        </button>

      </div>

      <form
        className="appointment-form"
        onSubmit={guardarCita}
      >

        <h3>
          {editandoId !== null
            ? "✏️ Editar cita"
            : "➕ Nueva cita"}
        </h3>

        <div className="appointment-grid">

          <select
            name="idCliente"
            value={
              formulario.idCliente
            }
            onChange={(event) => {

              setFormulario(
                (actual) => ({
                  ...actual,
                  idCliente:
                    event.target.value,
                  idVehiculo: ""
                })
              );

            }}
            required
          >

            <option value="">
              Selecciona un cliente
            </option>

            {clientesActivos.map(
              (cliente) => (

                <option
                  key={
                    cliente.idCliente
                  }
                  value={
                    cliente.idCliente
                  }
                >

                  {cliente.nombre}{" "}
                  {cliente.apellidoPaterno}{" "}
                  {cliente.apellidoMaterno}

                </option>

              )
            )}

          </select>

          <select
            name="idVehiculo"
            value={
              formulario.idVehiculo
            }
            onChange={handleChange}
            required
            disabled={
              !formulario.idCliente
            }
          >

            <option value="">
              Selecciona un vehículo
            </option>

            {vehiculosCliente.map(
              (vehiculo) => (

                <option
                  key={
                    vehiculo.idVehiculo
                  }
                  value={
                    vehiculo.idVehiculo
                  }
                >

                  {vehiculo.placas}
                  {" - "}
                  {vehiculo.vin}

                </option>

              )
            )}

          </select>

          <input
            type="date"
            name="fecha"
            value={
              formulario.fecha
            }
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="hora"
            value={
              formulario.hora
            }
            onChange={handleChange}
            required
          />

          <select
            name="estatus"
            value={
              formulario.estatus
            }
            onChange={handleChange}
          >

            <option value="Pendiente">
              Pendiente
            </option>

            <option value="Confirmada">
              Confirmada
            </option>

            <option value="Cancelada">
              Cancelada
            </option>

            <option value="Finalizada">
              Finalizada
            </option>

          </select>

          <textarea
            name="observaciones"
            placeholder="Observaciones"
            value={
              formulario.observaciones
            }
            onChange={handleChange}
          />

        </div>

        <div className="appointment-actions">

          <button
            className="appointment-save"
            type="submit"
          >

            {editandoId !== null
              ? "💾 Guardar cambios"
              : "📅 Registrar cita"}

          </button>

          {editandoId !== null && (

            <button
              type="button"
              className="appointment-cancel"
              onClick={
                cancelarEdicion
              }
            >
              Cancelar
            </button>

          )}

        </div>

      </form>

      {mensaje && (
        <div className="calendar-success">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="calendar-error">
          {error}
        </div>
      )}

      {!cargando && (

        <div className="calendar-table-container">

          <table className="calendar-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estatus</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {citas.map(
                (cita) => (

                  <tr
                    key={
                      cita.idCita
                    }
                  >

                    <td>
                      {cita.idCita}
                    </td>

                    <td>
                      {obtenerNombreCliente(
                        cita.idCliente
                      )}
                    </td>

                    <td>
                      {obtenerVehiculo(
                        cita.idVehiculo
                      )}
                    </td>

                    <td>
                      {cita.fecha}
                    </td>

                    <td>
                      {cita.hora}
                    </td>

                    <td>
  <span
    className={`appointment-status ${cita.estatus.toLowerCase()}`}
  >
    {cita.estatus}
  </span>
</td>

                    <td>
                      {cita.observaciones ||
                        "-"}
                    </td>

                    <td>

                      <div className="calendar-actions">

                        <button
                          type="button"
                          className="calendar-edit"
                          onClick={() =>
                            prepararEdicion(
                              cita
                            )
                          }
                        >
                          ✏️
                        </button>

                        {cita.estatus !== "Finalizada" &&
 cita.estatus !== "Cancelada" && (
  <button
    type="button"
    className="calendar-delete"
    title="Cancelar cita"
    onClick={() =>
      cancelarCita(cita)
    }
  >
    🚫
  </button>
)}

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}

export default Calendar;