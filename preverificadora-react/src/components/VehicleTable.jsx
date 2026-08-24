import { useEffect, useState } from "react";
import "../styles/Table.css";

// VehicleTable.jsx
import API_URL from "../config/api";

const API = `${API_URL}/api/vehiculos`;
const API_CLIENTES = `${API_URL}/api/clientes`;
const API_MODELOS = `${API_URL}/api/modelos`;
const API_TIPOS = `${API_URL}/api/tipos-vehiculo`;
const API_COMBUSTIBLES = `${API_URL}/api/combustibles`;

const formularioInicial = {
  idCliente: "",
  idModelo: "",
  idTipo: "",
  idCombustible: "",
  placas: "",
  vin: "",
  anio: "",
  numeroSerie: "",
  activo: true
};

function VehicleTable() {

  const [vehiculos, setVehiculos] =
    useState([]);

  const [clientes, setClientes] =
    useState([]);

  const [modelos, setModelos] =
    useState([]);

  const [tipos, setTipos] =
    useState([]);

  const [combustibles, setCombustibles] =
    useState([]);

  const [formulario, setFormulario] =
    useState(formularioInicial);

  const [editandoId, setEditandoId] =
    useState(null);

  const [cargando, setCargando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  const [error, setError] =
    useState("");

  // ======================================================
  // CARGAR VEHÍCULOS
  // ======================================================

  const cargarVehiculos = async () => {

    setCargando(true);
    setError("");

    try {

      const respuesta =
        await fetch(API);

      if (!respuesta.ok) {

        throw new Error(
          "No fue posible consultar los vehículos"
        );
      }

      const datos =
        await respuesta.json();

      setVehiculos(datos);

    } catch (err) {

      console.error(err);

      setError(
        "❌ Error al cargar los vehículos"
      );

    } finally {

      setCargando(false);
    }
  };

  // ======================================================
  // CARGAR EMPLEADOS
  // ======================================================

  const cargarClientes = async () => {

    try {

      const respuesta =
        await fetch(API_CLIENTES);

      if (!respuesta.ok) {

        throw new Error(
          "No fue posible consultar los empleados"
        );
      }

      const datos =
        await respuesta.json();

      setClientes(datos);

    } catch (err) {

      console.error(
        "Error al cargar empleados:",
        err
      );
    }
  };

  // ======================================================
  // CARGAR MODELOS
  // ======================================================

  const cargarModelos = async () => {

    try {

      const respuesta =
        await fetch(API_MODELOS);

      if (!respuesta.ok) {

        throw new Error(
          "No fue posible consultar los modelos"
        );
      }

      const datos =
        await respuesta.json();

      setModelos(datos);

    } catch (err) {

      console.error(
        "Error al cargar modelos:",
        err
      );
    }
  };

  // ======================================================
  // CARGAR TIPOS DE VEHÍCULO
  // ======================================================

  const cargarTipos = async () => {

    try {

      const respuesta =
        await fetch(API_TIPOS);

      if (!respuesta.ok) {

        throw new Error(
          "No fue posible consultar los tipos de vehículo"
        );
      }

      const datos =
        await respuesta.json();

      setTipos(datos);

    } catch (err) {

      console.error(
        "Error al cargar tipos:",
        err
      );
    }
  };

  // ======================================================
  // CARGAR COMBUSTIBLES
  // ======================================================

  const cargarCombustibles = async () => {

    try {

      const respuesta =
        await fetch(
          API_COMBUSTIBLES
        );

      if (!respuesta.ok) {

        throw new Error(
          "No fue posible consultar los combustibles"
        );
      }

      const datos =
        await respuesta.json();

      setCombustibles(datos);

    } catch (err) {

      console.error(
        "Error al cargar combustibles:",
        err
      );
    }
  };

  // ======================================================
  // CARGAR TODO AL INICIAR
  // ======================================================

  useEffect(() => {

    cargarVehiculos();
    cargarClientes();
    cargarModelos();
    cargarTipos();
    cargarCombustibles();

  }, []);

  // ======================================================
  // INPUTS
  // ======================================================

  const handleChange = (event) => {

    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setFormulario({
      ...formulario,

      [name]:
        type === "checkbox"
          ? checked
          : value
    });
  };

  // ======================================================
  // GUARDAR / ACTUALIZAR VEHÍCULO
  // ======================================================

  const guardarVehiculo = async (
    event
  ) => {

    event.preventDefault();

    setMensaje("");
    setError("");

    try {

      const idClienteFinal =
        formulario.idCliente;

      if (!idClienteFinal) {

        throw new Error(
          "Selecciona un empleado"
        );
      }

      if (!formulario.idModelo) {

        throw new Error(
          "Selecciona un modelo"
        );
      }

      if (!formulario.idTipo) {

        throw new Error(
          "Selecciona un tipo de vehículo"
        );
      }

      if (!formulario.idCombustible) {

        throw new Error(
          "Selecciona un combustible"
        );
      }

      const vehiculo = {

        idCliente:
          Number(idClienteFinal),

        idModelo:
          Number(
            formulario.idModelo
          ),

        idTipo:
          Number(
            formulario.idTipo
          ),

        idCombustible:
          Number(
            formulario.idCombustible
          ),

        placas:
          formulario.placas.trim(),

        vin:
          formulario.vin.trim(),

        anio:
          formulario.anio !== ""
            ? Number(
                formulario.anio
              )
            : null,

        numeroSerie:
          formulario.numeroSerie.trim(),

        activo:
          formulario.activo
      };

      let respuesta;

      // ==================================================
      // EDITAR
      // ==================================================

      if (editandoId !== null) {

        respuesta =
          await fetch(
            `${API}/${editandoId}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  vehiculo
                )
            }
          );

      }

      // ==================================================
      // REGISTRAR
      // ==================================================

      else {

        respuesta =
          await fetch(
            API,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  vehiculo
                )
            }
          );
      }

      if (!respuesta.ok) {

        const texto =
          await respuesta.text();

        throw new Error(
          texto ||
          "No fue posible guardar el vehículo"
        );
      }

      if (editandoId !== null) {

        setMensaje(
          "✅ Vehículo actualizado correctamente"
        );

      } else {

        setMensaje(
          "✅ Vehículo registrado correctamente"
        );
      }

      cancelarEdicion();

      await cargarVehiculos();

    } catch (err) {

      console.error(err);

      setError(
        `❌ ${err.message}`
      );
    }
  };

  // ======================================================
  // PREPARAR EDICIÓN
  // ======================================================

  const prepararEdicion = (
    vehiculo
  ) => {

    setEditandoId(
      vehiculo.idVehiculo
    );

    setFormulario({

      idCliente:
        vehiculo.idCliente ?? "",

      idModelo:
        vehiculo.idModelo ?? "",

      idTipo:
        vehiculo.idTipo ?? "",

      idCombustible:
        vehiculo.idCombustible ?? "",

      placas:
        vehiculo.placas ?? "",

      vin:
        vehiculo.vin ?? "",

      anio:
        vehiculo.anio ?? "",

      numeroSerie:
        vehiculo.numeroSerie ?? "",

      activo:
        vehiculo.activo ?? true
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // ======================================================
  // CANCELAR EDICIÓN
  // ======================================================

  const cancelarEdicion = () => {

    setFormulario(
      formularioInicial
    );

    setEditandoId(null);
  };

  // ======================================================
  // DESACTIVAR VEHÍCULO
  // ======================================================

  const desactivarVehiculo =
    async (vehiculo) => {

      const confirmar =
        window.confirm(
          `¿Deseas desactivar el vehículo ${vehiculo.placas}?`
        );

      if (!confirmar) {

        return;
      }

      setMensaje("");
      setError("");

      try {

        const actualizado = {

          idCliente:
            vehiculo.idCliente,

          idModelo:
            vehiculo.idModelo,

          idTipo:
            vehiculo.idTipo,

          idCombustible:
            vehiculo.idCombustible,

          placas:
            vehiculo.placas,

          vin:
            vehiculo.vin,

          anio:
            vehiculo.anio,

          numeroSerie:
            vehiculo.numeroSerie,

          activo:
            false
        };

        const respuesta =
          await fetch(
            `${API}/${vehiculo.idVehiculo}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify(
                  actualizado
                )
            }
          );

        if (!respuesta.ok) {

          throw new Error(
            "No fue posible desactivar el vehículo"
          );
        }

        setMensaje(
          "✅ Vehículo desactivado correctamente"
        );

        await cargarVehiculos();

      } catch (err) {

        console.error(err);

        setError(
          "❌ No fue posible desactivar el vehículo"
        );
      }
    };

  // ======================================================
  // OBTENER NOMBRE DEL EMPLEADO
  // ======================================================

  const obtenerNombreCliente = (
    idCliente
  ) => {

    const cliente =
      clientes.find(
        (cliente) =>
          cliente.idCliente ===
          idCliente
      );

    if (!cliente) {

      return "Empleado no disponible";
    }

    return `${cliente.nombre ?? ""} ${
      cliente.apellidoPaterno ?? ""
    } ${
      cliente.apellidoMaterno ?? ""
    }`.trim();
  };

  // ======================================================
  // OBTENER MODELO
  // ======================================================

  const obtenerNombreModelo = (
    idModelo
  ) => {

    const modelo =
      modelos.find(
        (modelo) =>
          modelo.idModelo ===
          idModelo
      );

    return modelo
      ? modelo.nombre
      : "-";
  };

  // ======================================================
  // OBTENER TIPO
  // ======================================================

  const obtenerNombreTipo = (
    idTipo
  ) => {

    const tipo =
      tipos.find(
        (tipo) =>
          tipo.idTipo ===
          idTipo
      );

    return tipo
      ? tipo.nombre
      : "-";
  };

  // ======================================================
  // OBTENER COMBUSTIBLE
  // ======================================================

  const obtenerNombreCombustible = (
    idCombustible
  ) => {

    const combustible =
      combustibles.find(
        (combustible) =>
          combustible.idCombustible ===
          idCombustible
      );

    return combustible
      ? combustible.nombre
      : "-";
  };

  // ======================================================
  // SOLO EMPLEADOS ACTIVOS
  // ======================================================

  const clientesActivos =
    clientes.filter(
      (cliente) =>
        cliente.activo === true
    );

  // ======================================================
  // SOLO VEHÍCULOS ACTIVOS
  // ======================================================

  const vehiculosActivos =
    vehiculos.filter(
      (vehiculo) =>
        vehiculo.activo === true
    );

  // ======================================================
  // INTERFAZ
  // ======================================================

  return (

    <section className="vehicle-section">

      {/* ==================================================
          ENCABEZADO
      ================================================== */}

      <div className="vehicle-header">

        <div>

          <h2>
            🚗 Administración de Vehículos
          </h2>

          <p>
            Registro y administración
            de unidades vehiculares.
          </p>

        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={cargarVehiculos}
        >
          🔄 Actualizar
        </button>

      </div>

      {/* ==================================================
          FORMULARIO
      ================================================== */}

      <form
        className="vehicle-form"
        onSubmit={guardarVehiculo}
      >

        <h3>

          {editandoId !== null
            ? "✏️ Editar vehículo"
            : "➕ Registrar vehículo"}

        </h3>

        <div className="form-grid">

          {/* ==============================================
              EMPLEADO
          ============================================== */}

          <select
            name="idCliente"
            value={
              formulario.idCliente
            }
            onChange={handleChange}
            required
          >

            <option value="">
              Selecciona un empleado
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

          {/* ==============================================
              MODELO
          ============================================== */}

          <select
            name="idModelo"
            value={
              formulario.idModelo
            }
            onChange={handleChange}
            required
          >

            <option value="">
              Selecciona un modelo
            </option>

            {modelos.map(
              (modelo) => (

                <option
                  key={
                    modelo.idModelo
                  }
                  value={
                    modelo.idModelo
                  }
                >

                  {modelo.nombre}

                </option>

              )
            )}

          </select>

          {/* ==============================================
              TIPO
          ============================================== */}

          <select
            name="idTipo"
            value={
              formulario.idTipo
            }
            onChange={handleChange}
            required
          >

            <option value="">
              Selecciona un tipo
            </option>

            {tipos.map(
              (tipo) => (

                <option
                  key={
                    tipo.idTipo
                  }
                  value={
                    tipo.idTipo
                  }
                >

                  {tipo.nombre}

                </option>

              )
            )}

          </select>

          {/* ==============================================
              COMBUSTIBLE
          ============================================== */}

          <select
            name="idCombustible"
            value={
              formulario.idCombustible
            }
            onChange={handleChange}
            required
          >

            <option value="">
              Selecciona combustible
            </option>

            {combustibles.map(
              (combustible) => (

                <option
                  key={
                    combustible.idCombustible
                  }
                  value={
                    combustible.idCombustible
                  }
                >

                  {combustible.nombre}

                </option>

              )
            )}

          </select>

          {/* ==============================================
              PLACAS
          ============================================== */}

          <input
            name="placas"
            placeholder="Placas"
            value={
              formulario.placas
            }
            onChange={handleChange}
            required
          />

          {/* ==============================================
              VIN
          ============================================== */}

          <input
            name="vin"
            placeholder="VIN"
            value={
              formulario.vin
            }
            onChange={handleChange}
            required
          />

          {/* ==============================================
              AÑO
          ============================================== */}

          <input
            type="number"
            name="anio"
            placeholder="Año"
            min="1900"
            max="2100"
            value={
              formulario.anio
            }
            onChange={handleChange}
          />

          {/* ==============================================
              NÚMERO DE SERIE
          ============================================== */}

          <input
            name="numeroSerie"
            placeholder="Número de serie"
            value={
              formulario.numeroSerie
            }
            onChange={handleChange}
          />

        </div>

        {/* ==================================================
            BOTONES FORMULARIO
        ================================================== */}

        <div className="form-actions">

          <button
            className="save-button"
            type="submit"
          >

            {editandoId !== null
              ? "💾 Guardar cambios"
              : "➕ Registrar vehículo"}

          </button>

          {editandoId !== null && (

            <button
              type="button"
              className="cancel-button"
              onClick={
                cancelarEdicion
              }
            >
              Cancelar
            </button>

          )}

        </div>

      </form>

      {/* ==================================================
          MENSAJE CORRECTO
      ================================================== */}

      {mensaje && (

        <div className="crud-success">
          {mensaje}
        </div>

      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (

        <div className="vehicle-error">
          {error}
        </div>

      )}

      {/* ==================================================
          CARGANDO
      ================================================== */}

      {cargando && (

        <div className="vehicle-message">
          Cargando vehículos...
        </div>

      )}

      {/* ==================================================
          TABLA
      ================================================== */}

      {!cargando && (

        <div className="table-container">

          <table className="vehicle-table">

            <thead>

              <tr>

                <th>ID</th>

                <th>
                  Empleado
                </th>

                <th>
                  Modelo
                </th>

                <th>
                  Tipo
                </th>

                <th>
                  Combustible
                </th>

                <th>
                  Placas
                </th>

                <th>
                  VIN
                </th>

                <th>
                  Año
                </th>

                <th>
                  N.º Serie
                </th>

                <th>
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {vehiculosActivos.map(
                (vehiculo) => (

                  <tr
                    key={
                      vehiculo.idVehiculo
                    }
                  >

                    <td>
                      {vehiculo.idVehiculo}
                    </td>

                    {/* EMPLEADO */}

                    <td>

                      {obtenerNombreCliente(
                        vehiculo.idCliente
                      )}

                    </td>

                    {/* MODELO */}

                    <td>

                      {obtenerNombreModelo(
                        vehiculo.idModelo
                      )}

                    </td>

                    {/* TIPO */}

                    <td>

                      {obtenerNombreTipo(
                        vehiculo.idTipo
                      )}

                    </td>

                    {/* COMBUSTIBLE */}

                    <td>

                      {obtenerNombreCombustible(
                        vehiculo.idCombustible
                      )}

                    </td>

                    {/* PLACAS */}

                    <td>

                      <span className="placa">

                        {vehiculo.placas}

                      </span>

                    </td>

                    {/* VIN */}

                    <td>
                      {vehiculo.vin}
                    </td>

                    {/* AÑO */}

                    <td>
                      {vehiculo.anio || "-"}
                    </td>

                    {/* SERIE */}

                    <td>

                      {vehiculo.numeroSerie ||
                        "-"}

                    </td>

                    {/* ACCIONES */}

                    <td>

                      <div className="table-actions">

                        <button
                          type="button"
                          className="edit-button"
                          title="Editar vehículo"
                          onClick={() =>
                            prepararEdicion(
                              vehiculo
                            )
                          }
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          title="Desactivar vehículo"
                          onClick={() =>
                            desactivarVehiculo(
                              vehiculo
                            )
                          }
                        >
                          🚫
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {/* ==================================================
              SIN VEHÍCULOS
          ================================================== */}

          {vehiculosActivos.length === 0 && (

            <div className="vehicle-message">

              No hay vehículos activos registrados.

            </div>

          )}

        </div>

      )}

    </section>

  );
}

export default VehicleTable;