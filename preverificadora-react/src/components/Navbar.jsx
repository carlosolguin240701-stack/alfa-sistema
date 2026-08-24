import "../styles/Navbar.css";

function Navbar() {

  return (
    <header className="navbar">

      <div className="navbar-company">

        <img
          src="/alfa-logo.jpg"
          alt="Logo ALFA"
          className="navbar-logo"
        />

        <div className="navbar-company-text">

          <strong>
            Gestoría y Verificaciones ALFA
          </strong>

          <span>
            Sistema de Pre-Verificación Vehicular
          </span>

        </div>

      </div>

      <div className="navbar-actions">

        <button
          type="button"
          className="navbar-icon-button"
          title="Notificaciones"
        >
          🔔
        </button>

        <div className="navbar-user">

          <div className="navbar-avatar">
            👤
          </div>

          <div className="navbar-user-info">

            <strong>
              Administrador
            </strong>

            <span>
              Sesión activa
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;