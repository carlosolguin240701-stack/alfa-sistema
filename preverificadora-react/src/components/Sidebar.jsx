import "../styles/Sidebar.css";

function Sidebar({
  seccion,
  setSeccion
}) {

  const opciones = [
    {
      id: "inicio",
      icono: "🏠",
      texto: "Inicio"
    },
    {
      id: "clientes",
      icono: "👥",
      texto: "Empleados"
    },
    {
      id: "vehiculos",
      icono: "🚗",
      texto: "Vehículos"
    },
    {
      id: "citas",
      icono: "🗓️",
      texto: "Citas"
    },
    {
      id: "verificaciones",
      icono: "📋",
      texto: "Verificaciones"
    },
    {
      id: "reportes",
      icono: "📊",
      texto: "Reportes"
    },
    {
      id: "configuracion",
      icono: "⚙️",
      texto: "Configuración"
    }
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">

        <img
          src="/alfa-logo.jpg"
          alt="Gestoría y Verificaciones ALFA"
          className="sidebar-logo"
        />

        <div className="sidebar-brand-text">

          <h2>
            ALFA
          </h2>

          <span>
            Gestoría y Verificaciones
          </span>

        </div>

      </div>

      <nav className="sidebar-nav">

        <p className="menu-title">
          MENÚ PRINCIPAL
        </p>

        {opciones.map(
          (opcion) => (

            <button
              key={opcion.id}
              type="button"
              className={
                seccion === opcion.id
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() =>
                setSeccion(opcion.id)
              }
            >

              <span className="sidebar-icon">
                {opcion.icono}
              </span>

              <span>
                {opcion.texto}
              </span>

            </button>

          )
        )}

      </nav>

      <div className="sidebar-footer">

        <div className="system-dot" />

        <div>

          <strong>
            Sistema activo
          </strong>

          <span>
            Spring Boot + MySQL
          </span>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;