import { useState } from "react";
import "./styles/App.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardCards from "./components/DashboardCards";
import Statistics from "./components/Statistics";
import VehicleTable from "./components/VehicleTable";
import Calendar from "./components/Calendar";
import Activity from "./components/Activity";
import Footer from "./components/Footer";
import ClientsTable from "./components/ClientsTable";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import VerificationManager from "./components/VerificationManager";

function App() {
  const [seccion, setSeccion] = useState("inicio");

  const renderContenido = () => {
    switch (seccion) {

      case "inicio":
        return (
          <>
            <section className="welcome-section">
              <div>
                <span className="section-badge">
                  Sistema en línea
                </span>

                <h1>
                  Sistema de Pre-Verificación Vehicular
                </h1>

                <p>
                  Plataforma administrativa para la gestión
                  de empleados, vehículos, citas y procesos
                  de verificación.
                </p>
              </div>
            </section>

            <DashboardCards />

            <Statistics />

            <Activity />
          </>
        );

      case "clientes":
        return (
          <section className="module-page">

            <div className="module-title">
              <span>
                👥
              </span>

              <div>
                <h1>
                  Empleados
                </h1>

                <p>
                  Registro y administración de empleados.
                </p>
              </div>
            </div>

            <ClientsTable />

          </section>
        );

      case "vehiculos":
        return (
          <section className="module-page">

            <div className="module-title">
              <span>
                🚗
              </span>

              <div>
                <h1>
                  Vehículos
                </h1>

                <p>
                  Registro y administración de vehículos.
                </p>
              </div>
            </div>

            <VehicleTable />

          </section>
        );

      case "citas":
        return (
          <section className="module-page">

            <Calendar />

          </section>
        );

      case "verificaciones":
        return (
          <section className="module-page">

            <div className="module-title">

              <span>
                ✅
              </span>

              <div>
                <h1>
                  Verificaciones
                </h1>

                <p>
                  Resultados e historial de intentos vehiculares.
                </p>
              </div>

            </div>

            <VerificationManager />

          </section>
        );

      case "reportes":
        return (
          <section className="module-page">

            <div className="module-title">
              <span>
                📊
              </span>

              <div>
                <h1>
                  Reportes
                </h1>

                <p>
                  Indicadores administrativos y operativos.
                </p>
              </div>
            </div>

            <Reports />

          </section>
        );

      case "configuracion":
        return (
          <section className="module-page">

            <div className="module-title">
              <span>
                ⚙️
              </span>

              <div>
                <h1>
                  Configuración
                </h1>

                <p>
                  Administración general de la plataforma.
                </p>
              </div>
            </div>

            <Settings />

          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">

      <Sidebar
        seccion={seccion}
        setSeccion={setSeccion}
      />

      <main className="main-content">

        <Navbar />

        <div className="page-content">
          {renderContenido()}
        </div>

        <Footer />

      </main>

    </div>
  );
}

export default App;