import { useEffect, useState } from "react";
import "../styles/Activity.css";
import API_URL from "../config/api";

const API_CLIENTES = `${API_URL}/api/clientes`;
const API_VEHICULOS = `${API_URL}/api/vehiculos`;
const API_CITAS = `${API_URL}/api/citas`;

function Activity() {
  const [actividad, setActividad] =
    useState([]);

  const cargarActividad = async () => {
    try {
      const [
        respuestaClientes,
        respuestaVehiculos,
        respuestaCitas
      ] = await Promise.all([
        fetch(API_CLIENTES),
        fetch(API_VEHICULOS),
        fetch(API_CITAS)
      ]);

      const clientes =
        await respuestaClientes.json();

      const vehiculos =
        await respuestaVehiculos.json();

      const citas =
        await respuestaCitas.json();

      const registros = [];

      clientes
        .slice(-3)
        .reverse()
        .forEach((cliente) => {

          registros.push({
            id:
              `cliente-${cliente.idCliente}`,

            icono:
              "👤",

            titulo:
              "Cliente registrado",

            descripcion:
              `${cliente.nombre ?? ""} ${
                cliente.apellidoPaterno ?? ""
              }`.trim()
          });

        });

      vehiculos
        .slice(-3)
        .reverse()
        .forEach((vehiculo) => {

          registros.push({
            id:
              `vehiculo-${vehiculo.idVehiculo}`,

            icono:
              "🚗",

            titulo:
              "Vehículo registrado",

            descripcion:
              `${vehiculo.placas ?? "Sin placas"} - ${
                vehiculo.vin ?? ""
              }`
          });

        });

      citas
        .slice(-3)
        .reverse()
        .forEach((cita) => {

          registros.push({
            id:
              `cita-${cita.idCita}`,

            icono:
              "📅",

            titulo:
              "Cita registrada",

            descripcion:
              `${cita.fecha} ${cita.hora} · ${cita.estatus}`
          });

        });

      setActividad(
        registros.slice(0, 7)
      );

    } catch (error) {
      console.error(
        "Error cargando actividad:",
        error
      );
    }
  };

  useEffect(() => {
    cargarActividad();
  }, []);

  return (
    <section className="activity-section">

      <div className="activity-header">

        <div>
          <h2>
            🕒 Actividad reciente
          </h2>

          <p>
            Últimos registros disponibles
            en la base de datos.
          </p>
        </div>

      </div>

      {actividad.length === 0 ? (

        <div className="activity-empty">
          No hay actividad registrada.
        </div>

      ) : (

        <div className="activity-list">

          {actividad.map(
            (registro) => (

              <div
                className="activity-item"
                key={registro.id}
              >

                <div className="activity-icon">
                  {registro.icono}
                </div>

                <div>

                  <strong>
                    {registro.titulo}
                  </strong>

                  <span>
                    {registro.descripcion}
                  </span>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </section>
  );
}

export default Activity;