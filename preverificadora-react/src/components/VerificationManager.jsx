import { useEffect, useState } from "react";
import "../styles/Verification.css";

// VerificationManager.jsx
import API_URL from "../config/api";

const API_VERIFICACIONES = `${API_URL}/api/verificaciones`;
const API_CITAS = `${API_URL}/api/citas`;
const API_VEHICULOS = `${API_URL}/api/vehiculos`;
const API_CLIENTES = `${API_URL}/api/clientes`;
const API_MODELOS = `${API_URL}/api/modelos`;

function VerificationManager() {
  const [verificaciones, setVerificaciones] = useState([]);
  const [citas, setCitas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [modelos, setModelos] = useState([]);

  const [idCita, setIdCita] = useState("");
  const [resultado, setResultado] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [vehiculoHistorial, setVehiculoHistorial] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  // ======================================================
  // CARGAR DATOS
  // ======================================================

  const cargarDatos = async () => {
    setCargando(true);
    setError("");

    try {
      const [
        resVerificaciones,
        resCitas,
        resVehiculos,
        resClientes,
        resModelos
      ] = await Promise.all([
        fetch(API_VERIFICACIONES),
        fetch(API_CITAS),
        fetch(API_VEHICULOS),
        fetch(API_CLIENTES),
        fetch(API_MODELOS)
      ]);

      if (
        !resVerificaciones.ok ||
        !resCitas.ok ||
        !resVehiculos.ok ||
        !resClientes.ok ||
        !resModelos.ok
      ) {
        throw new Error(
          "No fue posible consultar la información."
        );
      }

      const [
        datosVerificaciones,
        datosCitas,
        datosVehiculos,
        datosClientes,
        datosModelos
      ] = await Promise.all([
        resVerificaciones.json(),
        resCitas.json(),
        resVehiculos.json(),
        resClientes.json(),
        resModelos.json()
      ]);

      setVerificaciones(datosVerificaciones);
      setCitas(datosCitas);
      setVehiculos(datosVehiculos);
      setClientes(datosClientes);
      setModelos(datosModelos);

    } catch (err) {
      console.error(err);

      setError(
        "❌ No fue posible cargar las verificaciones."
      );

    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ======================================================
  // HELPERS
  // ======================================================

  const obtenerCliente = (idCliente) => {
    const cliente =
      clientes.find(
        (item) =>
          item.idCliente === idCliente
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

  const obtenerVehiculo = (idVehiculo) => {
    return vehiculos.find(
      (vehiculo) =>
        vehiculo.idVehiculo === idVehiculo
    );
  };

  const obtenerModelo = (idModelo) => {
    const modelo =
      modelos.find(
        (item) =>
          item.idModelo === idModelo
      );

    return modelo
      ? modelo.nombre
      : "Sin modelo";
  };

  const obtenerCita = (idCitaBuscar) => {
    return citas.find(
      (cita) =>
        cita.idCita === idCitaBuscar
    );
  };

  // ======================================================
  // VERIFICACIONES POR VEHÍCULO
  // ======================================================

  const obtenerVerificacionesVehiculo = (
    idVehiculo
  ) => {
    const idsCitas =
      citas
        .filter(
          (cita) =>
            cita.idVehiculo === idVehiculo
        )
        .map(
          (cita) =>
            cita.idCita
        );

    return verificaciones
      .filter(
        (verificacion) =>
          idsCitas.includes(
            verificacion.idCita
          )
      )
      .sort(
        (a, b) =>
          b.idVerificacion -
          a.idVerificacion
      );
  };

  const obtenerIntentos = (idVehiculo) => {
    return obtenerVerificacionesVehiculo(
      idVehiculo
    ).length;
  };

  const obtenerRechazos = (idVehiculo) => {
    return obtenerVerificacionesVehiculo(
      idVehiculo
    ).filter(
      (verificacion) =>
        verificacion.estatus === "Rechazada"
    ).length;
  };

  const obtenerUltimoResultado = (
    idVehiculo
  ) => {
    const registros =
      obtenerVerificacionesVehiculo(
        idVehiculo
      );

    if (registros.length === 0) {
      return "Sin verificar";
    }

    return registros[0].estatus;
  };

  // ======================================================
  // FORMATEAR FECHA
  // ======================================================

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "Sin fecha";
    }

    const objetoFecha =
      new Date(fecha);

    if (
      Number.isNaN(
        objetoFecha.getTime()
      )
    ) {
      return fecha;
    }

    return objetoFecha.toLocaleString(
      "es-MX",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );
  };

  // ======================================================
  // GUARDAR RESULTADO
  // ======================================================

  const guardarResultado = async (
    event
  ) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    if (!idCita) {
      setError(
        "❌ Selecciona una cita."
      );

      return;
    }

    if (!resultado) {
      setError(
        "❌ Selecciona Aprobado o Rechazado."
      );

      return;
    }

    if (
      resultado === "Rechazado" &&
      !observaciones.trim()
    ) {
      setError(
        "❌ Escribe el motivo del rechazo."
      );

      return;
    }

    setGuardando(true);

    try {
      const respuesta =
        await fetch(
          `${API_VERIFICACIONES}/resultado`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              idCita:
                Number(idCita),

              resultado,

              observaciones:
                observaciones.trim()
            })
          }
        );

      const datos =
        await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
          "No se pudo registrar el resultado."
        );
      }

      setMensaje(
        `✅ ${datos.resultado} · Intento #${datos.intento} · Folio ${datos.folio}`
      );

      setResultado("");
      setObservaciones("");

      await cargarDatos();

    } catch (err) {
      console.error(err);

      setError(
        `❌ ${err.message}`
      );

    } finally {
      setGuardando(false);
    }
  };

  // ======================================================
  // ABRIR HISTORIAL
  // ======================================================

  const abrirHistorial = (vehiculo) => {
    setVehiculoHistorial(vehiculo);

    setTimeout(() => {
      document
        .getElementById(
          "historial-verificaciones"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    }, 50);
  };

  // ======================================================
  // INTERFAZ
  // ======================================================

  return (
    <section className="verification-section">

      <div className="verification-header">

        <div>
          <span className="verification-badge">
            Control de resultados
          </span>

          <h2>
            ✅ Verificación Vehicular
          </h2>

          <p>
            Registra resultados y consulta
            el historial de cada unidad.
          </p>
        </div>

        <button
          type="button"
          className="verification-refresh"
          onClick={cargarDatos}
        >
          🔄 Actualizar
        </button>

      </div>

      {/* ==================================================
          FORMULARIO
      ================================================== */}

      <form
        className="verification-form"
        onSubmit={guardarResultado}
      >

        <h3>
          Registrar resultado
        </h3>

        <div className="verification-form-grid">

          <div className="verification-field">

            <label>
              Cita / Vehículo
            </label>

            <select
              value={idCita}
              onChange={(event) =>
                setIdCita(
                  event.target.value
                )
              }
              required
            >

              <option value="">
                Selecciona una cita
              </option>

              {citas.map((cita) => {
                const vehiculo =
                  obtenerVehiculo(
                    cita.idVehiculo
                  );

                return (
                  <option
                    key={cita.idCita}
                    value={cita.idCita}
                  >
                    Cita #{cita.idCita}
                    {" · "}
                    {vehiculo?.placas ??
                      "Sin placas"}
                    {" · "}
                    {obtenerCliente(
                      cita.idCliente
                    )}
                  </option>
                );
              })}

            </select>

          </div>

          <div className="verification-field">

            <label>
              Resultado
            </label>

            <div className="result-buttons">

              <button
                type="button"
                className={
                  resultado === "Aprobado"
                    ? "result-button approved active"
                    : "result-button approved"
                }
                onClick={() =>
                  setResultado(
                    "Aprobado"
                  )
                }
              >
                ✅ Aprobado
              </button>

              <button
                type="button"
                className={
                  resultado === "Rechazado"
                    ? "result-button rejected active"
                    : "result-button rejected"
                }
                onClick={() =>
                  setResultado(
                    "Rechazado"
                  )
                }
              >
                ❌ Rechazado
              </button>

            </div>

          </div>

          <div className="verification-field verification-wide">

            <label>
              {resultado === "Rechazado"
                ? "Motivo del rechazo"
                : "Observaciones"}
            </label>

            <textarea
              value={observaciones}
              onChange={(event) =>
                setObservaciones(
                  event.target.value
                )
              }
              placeholder={
                resultado === "Rechazado"
                  ? "Ej. Emisiones fuera del rango permitido..."
                  : "Observaciones de la verificación..."
              }
            />

          </div>

        </div>

        <button
          type="submit"
          className="verification-save"
          disabled={guardando}
        >
          {guardando
            ? "Guardando..."
            : "💾 Guardar resultado"}
        </button>

      </form>

      {mensaje && (
        <div className="verification-success">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="verification-error">
          {error}
        </div>
      )}

      {/* ==================================================
          RESUMEN DE VEHÍCULOS
      ================================================== */}

      <div className="verification-table-title">

        <div>
          <h3>
            Historial por vehículo
          </h3>

          <p>
            Intentos y último resultado registrado.
          </p>
        </div>

      </div>

      <div className="verification-table-container">

        <table className="verification-table">

          <thead>

            <tr>
              <th>Vehículo</th>
              <th>Cliente</th>
              <th>Modelo</th>
              <th>Intentos</th>
              <th>Rechazos</th>
              <th>Último resultado</th>
              <th>Historial</th>
            </tr>

          </thead>

          <tbody>

            {vehiculos.map(
              (vehiculo) => {

                const ultimo =
                  obtenerUltimoResultado(
                    vehiculo.idVehiculo
                  );

                return (
                  <tr
                    key={
                      vehiculo.idVehiculo
                    }
                  >

                    <td>
                      <strong>
                        {vehiculo.placas}
                      </strong>

                      <small>
                        {vehiculo.vin}
                      </small>
                    </td>

                    <td>
                      {obtenerCliente(
                        vehiculo.idCliente
                      )}
                    </td>

                    <td>
                      {obtenerModelo(
                        vehiculo.idModelo
                      )}
                    </td>

                    <td>
                      <span className="attempt-badge">
                        {obtenerIntentos(
                          vehiculo.idVehiculo
                        )}
                      </span>
                    </td>

                    <td>
                      <span className="reject-count">
                        {obtenerRechazos(
                          vehiculo.idVehiculo
                        )}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          ultimo === "Aprobada"
                            ? "verification-status approved"
                            : ultimo === "Rechazada"
                            ? "verification-status rejected"
                            : "verification-status pending"
                        }
                      >
                        {ultimo}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="history-button"
                        onClick={() =>
                          abrirHistorial(
                            vehiculo
                          )
                        }
                      >
                        📋 Ver historial
                      </button>
                    </td>

                  </tr>
                );
              }
            )}

          </tbody>

        </table>

      </div>

      {/* ==================================================
          HISTORIAL DETALLADO
      ================================================== */}

      {vehiculoHistorial && (

        <div
          id="historial-verificaciones"
          className="verification-history"
        >

          <div className="history-header">

            <div>

              <span className="history-label">
                Expediente vehicular
              </span>

              <h3>
                🚗 {vehiculoHistorial.placas}
                {" · "}
                {obtenerModelo(
                  vehiculoHistorial.idModelo
                )}
              </h3>

              <p>
                {obtenerCliente(
                  vehiculoHistorial.idCliente
                )}
                {" · "}
                VIN {vehiculoHistorial.vin}
              </p>

            </div>

            <button
              type="button"
              className="history-close"
              onClick={() =>
                setVehiculoHistorial(null)
              }
            >
              ✕ Cerrar
            </button>

          </div>

          <div className="history-summary">

            <div>
              <span>
                Intentos
              </span>

              <strong>
                {obtenerIntentos(
                  vehiculoHistorial.idVehiculo
                )}
              </strong>
            </div>

            <div>
              <span>
                Rechazos
              </span>

              <strong>
                {obtenerRechazos(
                  vehiculoHistorial.idVehiculo
                )}
              </strong>
            </div>

            <div>
              <span>
                Estado actual
              </span>

              <strong>
                {obtenerUltimoResultado(
                  vehiculoHistorial.idVehiculo
                )}
              </strong>
            </div>

          </div>

          {obtenerVerificacionesVehiculo(
            vehiculoHistorial.idVehiculo
          ).length === 0 ? (

            <div className="history-empty">

              <span>
                📭
              </span>

              <h4>
                Sin verificaciones registradas
              </h4>

              <p>
                Este vehículo todavía no cuenta
                con intentos de verificación.
              </p>

            </div>

          ) : (

            <div className="history-timeline">

              {obtenerVerificacionesVehiculo(
                vehiculoHistorial.idVehiculo
              ).map(
                (
                  verificacion,
                  indice
                ) => {

                  const total =
                    obtenerVerificacionesVehiculo(
                      vehiculoHistorial.idVehiculo
                    ).length;

                  const numeroIntento =
                    total - indice;

                  const cita =
                    obtenerCita(
                      verificacion.idCita
                    );

                  return (

                    <article
                      className={
                        verificacion.estatus ===
                        "Aprobada"
                          ? "history-item approved"
                          : "history-item rejected"
                      }
                      key={
                        verificacion.idVerificacion
                      }
                    >

                      <div className="history-marker">

                        {verificacion.estatus ===
                        "Aprobada"
                          ? "✓"
                          : "✕"}

                      </div>

                      <div className="history-content">

                        <div className="history-item-header">

                          <div>

                            <span className="attempt-label">
                              Intento #{numeroIntento}
                            </span>

                            <h4>
                              {verificacion.estatus}
                            </h4>

                          </div>

                          <span
                            className={
                              verificacion.estatus ===
                              "Aprobada"
                                ? "history-result approved"
                                : "history-result rejected"
                            }
                          >
                            {verificacion.estatus}
                          </span>

                        </div>

                        <div className="history-details">

                          <div>
                            <span>
                              Folio
                            </span>

                            <strong>
                              {verificacion.folio ||
                                "-"}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Tipo
                            </span>

                            <strong>
                              {verificacion.tipoVerificacion ||
                                "-"}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Fecha
                            </span>

                            <strong>
                              {formatearFecha(
                                verificacion.fechaFin ||
                                verificacion.fechaInicio ||
                                verificacion.fechaRegistro
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Cita
                            </span>

                            <strong>
                              {cita
                                ? `#${cita.idCita} · ${cita.fecha}`
                                : "-"}
                            </strong>
                          </div>

                        </div>

                        <div className="history-observations">

                          <span>
                            {verificacion.estatus ===
                            "Rechazada"
                              ? "Motivo del rechazo"
                              : "Observaciones"}
                          </span>

                          <p>
                            {verificacion.observaciones ||
                              "Sin observaciones registradas."}
                          </p>

                        </div>

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          )}

        </div>

      )}

      {cargando && (
        <div className="verification-loading">
          Cargando información...
        </div>
      )}

    </section>
  );
}

export default VerificationManager;