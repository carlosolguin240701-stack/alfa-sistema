import { useEffect, useState } from "react";
import "../styles/Reports.css";

// Reports.jsx
import API_URL from "../config/api";

const API_DASHBOARD = `${API_URL}/api/dashboard/resumen`;
const API_CITAS = `${API_URL}/api/citas`;
const API_VERIFICACIONES = `${API_URL}/api/verificaciones`;

function Reports() {
  const [datos, setDatos] = useState({
    clientes: 0,
    vehiculos: 0,
    citasHoy: 0,
    porcentajeAprobadas: 0
  });

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState("");

  const cargarReportes = async () => {
    setCargando(true);
    setError("");

    try {
      const respuesta =
        await fetch(API);

      if (!respuesta.ok) {
        throw new Error(
          "No fue posible cargar los reportes"
        );
      }

      const resumen =
        await respuesta.json();

      setDatos({
        clientes:
          resumen.clientes ?? 0,

        vehiculos:
          resumen.vehiculos ?? 0,

        citasHoy:
          resumen.citasHoy ?? 0,

        porcentajeAprobadas:
          resumen.porcentajeAprobadas ?? 0
      });

    } catch (err) {
      console.error(err);

      setError(
        "❌ No fue posible cargar los reportes"
      );

    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  const porcentajeRechazadas =
    Math.max(
      0,
      100 - datos.porcentajeAprobadas
    );

  return (
    <section className="reports-section">

      <div className="reports-header">

        <div>
          <span className="reports-badge">
            Reportes administrativos
          </span>

          <h2>
            📊 Reportes Generales
          </h2>

          <p>
            Resumen actualizado de la operación
            de la PreVerificadora.
          </p>
        </div>

        <button
          type="button"
          className="reports-refresh"
          onClick={cargarReportes}
        >
          🔄 Actualizar
        </button>

      </div>

      {error && (
        <div className="reports-error">
          {error}
        </div>
      )}

      {cargando ? (

        <div className="reports-loading">
          Cargando información...
        </div>

      ) : (

        <>
          <div className="reports-cards">

            <div className="report-card">
              <div className="report-icon">
                👥
              </div>

              <div>
                <span>
                  Clientes registrados
                </span>

                <strong>
                  {datos.clientes}
                </strong>
              </div>
            </div>

            <div className="report-card">
              <div className="report-icon">
                🚗
              </div>

              <div>
                <span>
                  Vehículos registrados
                </span>

                <strong>
                  {datos.vehiculos}
                </strong>
              </div>
            </div>

            <div className="report-card">
              <div className="report-icon">
                📅
              </div>

              <div>
                <span>
                  Citas de hoy
                </span>

                <strong>
                  {datos.citasHoy}
                </strong>
              </div>
            </div>

            <div className="report-card">
              <div className="report-icon">
                ✅
              </div>

              <div>
                <span>
                  Aprobación
                </span>

                <strong>
                  {datos.porcentajeAprobadas}%
                </strong>
              </div>
            </div>

          </div>

          <div className="reports-grid">

            <div className="report-panel">

              <div className="report-panel-header">
                <div>
                  <h3>
                    Estado de verificaciones
                  </h3>

                  <p>
                    Distribución porcentual
                    de resultados.
                  </p>
                </div>
              </div>

              <div className="verification-stat">

                <div className="verification-row">

                  <div className="verification-label">
                    <span>
                      ✅ Aprobadas
                    </span>

                    <strong>
                      {datos.porcentajeAprobadas}%
                    </strong>
                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-bar approved"
                      style={{
                        width:
                          `${datos.porcentajeAprobadas}%`
                      }}
                    />

                  </div>

                </div>

                <div className="verification-row">

                  <div className="verification-label">
                    <span>
                      ❌ Rechazadas
                    </span>

                    <strong>
                      {porcentajeRechazadas}%
                    </strong>
                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-bar rejected"
                      style={{
                        width:
                          `${porcentajeRechazadas}%`
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>

            <div className="report-panel">

              <div className="report-panel-header">
                <div>
                  <h3>
                    Resumen operativo
                  </h3>

                  <p>
                    Indicadores principales
                    del sistema.
                  </p>
                </div>
              </div>

              <div className="operational-list">

                <div>
                  <span>
                    Clientes activos
                  </span>

                  <strong>
                    {datos.clientes}
                  </strong>
                </div>

                <div>
                  <span>
                    Vehículos registrados
                  </span>

                  <strong>
                    {datos.vehiculos}
                  </strong>
                </div>

                <div>
                  <span>
                    Citas programadas hoy
                  </span>

                  <strong>
                    {datos.citasHoy}
                  </strong>
                </div>

                <div>
                  <span>
                    Tasa de aprobación
                  </span>

                  <strong>
                    {datos.porcentajeAprobadas}%
                  </strong>
                </div>

              </div>

            </div>

          </div>

          <div className="report-panel report-wide">

            <div className="report-panel-header">

              <div>
                <h3>
                  Actividad general
                </h3>

                <p>
                  Comparación visual de registros
                  actuales.
                </p>
              </div>

            </div>

            <div className="bar-chart">

              <div className="chart-item">

                <span>
                  Clientes
                </span>

                <div className="chart-track">
                  <div
                    className="chart-value"
                    style={{
                      width:
                        `${Math.min(
                          datos.clientes * 10,
                          100
                        )}%`
                    }}
                  />
                </div>

                <strong>
                  {datos.clientes}
                </strong>

              </div>

              <div className="chart-item">

                <span>
                  Vehículos
                </span>

                <div className="chart-track">
                  <div
                    className="chart-value"
                    style={{
                      width:
                        `${Math.min(
                          datos.vehiculos * 10,
                          100
                        )}%`
                    }}
                  />
                </div>

                <strong>
                  {datos.vehiculos}
                </strong>

              </div>

              <div className="chart-item">

                <span>
                  Citas hoy
                </span>

                <div className="chart-track">
                  <div
                    className="chart-value"
                    style={{
                      width:
                        `${Math.min(
                          datos.citasHoy * 10,
                          100
                        )}%`
                    }}
                  />
                </div>

                <strong>
                  {datos.citasHoy}
                </strong>

              </div>

            </div>

          </div>

        </>

      )}

    </section>
  );
}

export default Reports;