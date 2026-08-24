import { useEffect, useState } from "react";
import "../styles/Cards.css";

// DashboardCards.jsx
import API_URL from "../config/api";

const API = `${API_URL}/api/dashboard/resumen`;

function DashboardCards() {

  const [datos, setDatos] = useState({
    clientes: 0,
    vehiculos: 0,
    citasHoy: 0,
    intentos: 0,
    aprobadas: 0,
    rechazadas: 0,
    porcentajeAprobadas: 0
  });

  const [cargando, setCargando] =
    useState(true);

  const cargarResumen = async () => {

    try {

      const respuesta =
        await fetch(API);

      if (!respuesta.ok) {

        throw new Error(
          "No fue posible cargar el dashboard"
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

        intentos:
          resumen.intentos ?? 0,

        aprobadas:
          resumen.aprobadas ?? 0,

        rechazadas:
          resumen.rechazadas ?? 0,

        porcentajeAprobadas:
          resumen.porcentajeAprobadas ?? 0
      });

    } catch (error) {

      console.error(
        "Error cargando dashboard:",
        error
      );

    } finally {

      setCargando(false);
    }
  };

  useEffect(() => {

    cargarResumen();

    const intervalo =
      setInterval(
        cargarResumen,
        5000
      );

    return () =>
      clearInterval(intervalo);

  }, []);

  const tarjetas = [

    {
      icono: "👥",
      titulo: "Empleados",
      descripcion: "Registrados en el sistema",
      valor: datos.clientes
    },

    {
      icono: "🚗",
      titulo: "Vehículos",
      descripcion: "Unidades registradas",
      valor: datos.vehiculos
    },

    {
      icono: "📅",
      titulo: "Citas de hoy",
      descripcion: "Servicios programados",
      valor: datos.citasHoy
    },

    {
      icono: "🔄",
      titulo: "Intentos",
      descripcion: "Verificaciones realizadas",
      valor: datos.intentos
    },

    {
      icono: "✅",
      titulo: "Aprobadas",
      descripcion: "Verificaciones aprobadas",
      valor: datos.aprobadas
    },

    {
      icono: "❌",
      titulo: "Rechazadas",
      descripcion: "Verificaciones rechazadas",
      valor: datos.rechazadas
    },

    {
      icono: "📈",
      titulo: "Tasa de aprobación",
      descripcion: "Porcentaje general",
      valor:
        `${datos.porcentajeAprobadas}%`
    }

  ];

  return (

    <section className="dashboard-cards">

      {tarjetas.map(
        (tarjeta) => (

          <article
            className="dashboard-card"
            key={tarjeta.titulo}
          >

            <div className="dashboard-card-top">

              <div className="dashboard-card-icon">
                {tarjeta.icono}
              </div>

              <span className="dashboard-live">
                En vivo
              </span>

            </div>

            <div className="dashboard-card-info">

              <strong>
                {cargando
                  ? "..."
                  : tarjeta.valor}
              </strong>

              <h3>
                {tarjeta.titulo}
              </h3>

              <p>
                {tarjeta.descripcion}
              </p>

            </div>

          </article>

        )
      )}

    </section>

  );
}

export default DashboardCards;