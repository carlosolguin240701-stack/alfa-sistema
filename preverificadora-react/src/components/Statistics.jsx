import { useEffect, useState } from "react";
import "../styles/Statistics.css";
import API_URL from "../config/api";

const API =
  `${API_URL}/api/dashboard/resumen`;

const API_CITAS =
  `${API_URL}/api/citas`;


function Statistics() {

  const [datos, setDatos] = useState({
    intentos: 0,
    aprobadas: 0,
    rechazadas: 0,
    porcentajeAprobadas: 0,
    pendientes: 0,
    confirmadas: 0
  });

  const cargarEstadisticas = async () => {

    try {

      const [
        respuestaResumen,
        respuestaCitas
      ] = await Promise.all([
        fetch(API),
        fetch(API_CITAS)
      ]);

      const resumen =
        await respuestaResumen.json();

      const citas =
        await respuestaCitas.json();

      setDatos({

        intentos:
          resumen.intentos ?? 0,

        aprobadas:
          resumen.aprobadas ?? 0,

        rechazadas:
          resumen.rechazadas ?? 0,

        porcentajeAprobadas:
          resumen.porcentajeAprobadas ?? 0,

        pendientes:
          citas.filter(
            (cita) =>
              cita.estatus ===
              "Pendiente"
          ).length,

        confirmadas:
          citas.filter(
            (cita) =>
              cita.estatus ===
              "Confirmada"
          ).length
      });

    } catch (error) {

      console.error(
        "Error cargando estadísticas:",
        error
      );
    }
  };

  useEffect(() => {

    cargarEstadisticas();

    const intervalo =
      setInterval(
        cargarEstadisticas,
        5000
      );

    return () =>
      clearInterval(intervalo);

  }, []);

  return (

    <section className="statistics-section">

      <div className="statistics-header">

        <div>

          <h2>
            📈 Resumen operativo
          </h2>

          <p>
            Indicadores actualizados
            de la operación diaria.
          </p>

        </div>

        <span className="live-indicator">
          ● Datos en vivo
        </span>

      </div>

      <div className="statistics-grid">

        <div className="statistic-box">

          <span>
            Intentos realizados
          </span>

          <strong>
            {datos.intentos}
          </strong>

        </div>

        <div className="statistic-box">

          <span>
            Aprobadas
          </span>

          <strong>
            {datos.aprobadas}
          </strong>

        </div>

        <div className="statistic-box">

          <span>
            Rechazadas
          </span>

          <strong>
            {datos.rechazadas}
          </strong>

        </div>

        <div className="statistic-box">

          <span>
            Tasa de aprobación
          </span>

          <strong>
            {datos.porcentajeAprobadas}%
          </strong>

        </div>

        <div className="statistic-box">

          <span>
            Citas pendientes
          </span>

          <strong>
            {datos.pendientes}
          </strong>

        </div>

        <div className="statistic-box">

          <span>
            Citas confirmadas
          </span>

          <strong>
            {datos.confirmadas}
          </strong>

        </div>

      </div>

    </section>
  );
}

export default Statistics;