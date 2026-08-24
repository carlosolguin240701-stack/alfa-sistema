import "../styles/Settings.css";

function Settings() {
  return (
    <section className="settings-section">

      <div className="settings-header">

        <div>
          <span className="settings-badge">
            Información institucional
          </span>

          <h2>
            ⚙️ Configuración General
          </h2>

          <p>
            Datos principales de la PreVerificadora.
          </p>
        </div>

        <div className="settings-system-status">

          <span className="settings-status-dot" />

          <div>
            <strong>
              Sistema operativo
            </strong>

            <small>
              React + Spring Boot + MySQL
            </small>
          </div>

        </div>

      </div>

      <div className="settings-panel company-panel">

        <div className="company-logo-box">

          <img
            src="/alfa-logo.jpg"
            alt="Gestoría y Verificaciones ALFA"
            className="company-logo"
          />

        </div>

        <div className="company-info">

          <span className="company-label">
            PreVerificadora
          </span>

          <h2>
            Gestoría y Verificaciones ALFA
          </h2>

          <p className="company-description">
            Sistema administrativo para la gestión
            de clientes, vehículos, citas y procesos
            de pre-verificación vehicular.
          </p>

          <div className="company-data-grid">

            <div className="company-data-card">
              <span>
                🏢 Empresa
              </span>

              <strong>
                Gestoría y Verificaciones ALFA
              </strong>
            </div>

            <div className="company-data-card">
              <span>
                🏬 Sucursal
              </span>

              <strong>
                Sucursal Principal
              </strong>
            </div>

            <div className="company-data-card">
              <span>
                👤 Responsable
              </span>

              <strong>
                Administrador
              </strong>
            </div>

            <div className="company-data-card">
              <span>
                🕐 Horario
              </span>

              <strong>
                Lunes a Sábado 08:00 - 18:00
              </strong>
            </div>

          </div>

        </div>

      </div>

      <div className="settings-panel">

        <div className="settings-panel-title">

          <span>
            🔗
          </span>

          <div>
            <h3>
              Estado de servicios
            </h3>

            <p>
              Tecnologías utilizadas por la plataforma.
            </p>
          </div>

        </div>

        <div className="services-grid">

          <div className="service-status">

            <span className="service-icon">
              ⚛️
            </span>

            <div>
              <strong>
                React
              </strong>

              <p>
                Frontend
              </p>
            </div>

            <span className="service-online">
              Activo
            </span>

          </div>

          <div className="service-status">

            <span className="service-icon">
              ☕
            </span>

            <div>
              <strong>
                Spring Boot
              </strong>

              <p>
                API REST
              </p>
            </div>

            <span className="service-online">
              Activo
            </span>

          </div>

          <div className="service-status">

            <span className="service-icon">
              🐬
            </span>

            <div>
              <strong>
                MySQL
              </strong>

              <p>
                Base de datos
              </p>
            </div>

            <span className="service-online">
              Activo
            </span>

          </div>

          <div className="service-status">

            <span className="service-icon">
              🐳
            </span>

            <div>
              <strong>
                Docker
              </strong>

              <p>
                Contenedores
              </p>
            </div>

            <span className="service-online">
              Activo
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Settings;