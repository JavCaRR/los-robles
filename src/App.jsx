import { useState } from "react";
import "./App.css";

export default function App() {
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [correo, setCorreo] = useState("");
  const [vistaActual, setVistaActual] = useState("dashboard");
  const [pagos, setPagos] = useState([
    {
      id: 1,
      concepto: "Mantenimiento Agosto",
      monto: "$1,200",
      fecha: "2026-08-05",
      estatus: "Pagado",
    },
    {
      id: 2,
      concepto: "Cuota de Seguridad",
      monto: "$350",
      fecha: "2026-08-15",
      estatus: "Pagado",
    },
  ]);
  const [conceptoPago, setConceptoPago] = useState("Mantenimiento septiembre");
  const [montoPago, setMontoPago] = useState("1200");
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Mesa Directiva",
      correo: "mesa@losrobles.com",
      rol: "Administrador",
    },
    { id: 2, nombre: "Residente", correo, rol: "Residente" },
  ]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    rol: "Residente",
  });
  const [quejas, setQuejas] = useState([
    {
      id: 1,
      asunto: "Lámpara apagada en la calle principal",
      estado: "En revisión",
    },
    { id: 2, asunto: "Fuga de agua en el parque", estado: "Resuelto" },
  ]);
  const [nuevaQueja, setNuevaQueja] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (correo.trim() !== "") {
      setUsuarios((usuariosActuales) =>
        usuariosActuales.map((usuario) =>
          usuario.id === 2 ? { ...usuario, correo } : usuario,
        ),
      );
      setSesionIniciada(true);
    }
  };

  const handlePagar = (e) => {
    e.preventDefault();
    setPagos([
      {
        id: Date.now(),
        concepto: conceptoPago,
        monto: `$${montoPago}`,
        fecha: new Date().toISOString().split("T")[0],
        estatus: "Pagado",
      },
      ...pagos,
    ]);
    alert("¡Pago procesado con éxito!");
  };

  const descargarPDF = () => window.print();

  const agregarUsuario = (e) => {
    e.preventDefault();
    setUsuarios([{ id: Date.now(), ...nuevoUsuario }, ...usuarios]);
    setNuevoUsuario({ nombre: "", correo: "", rol: "Residente" });
  };

  const eliminarUsuario = (id) => {
    setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
  };

  const exportarReporte = () => {
    const contenido =
      "Concepto,Monto\nIngresos,$24,500\nEgresos,$16,200\nSaldo,$8,300";
    const enlace = document.createElement("a");
    enlace.href = `data:text/csv;charset=utf-8,${encodeURIComponent(contenido)}`;
    enlace.download = "reporte-financiero.csv";
    enlace.click();
  };

  const registrarQueja = (e) => {
    e.preventDefault();
    if (nuevaQueja.trim()) {
      setQuejas([
        { id: Date.now(), asunto: nuevaQueja, estado: "Abierto" },
        ...quejas,
      ]);
      setNuevaQueja("");
    }
  };

  const actualizarQueja = (id, estado) => {
    setQuejas(
      quejas.map((queja) => (queja.id === id ? { ...queja, estado } : queja)),
    );
  };

  if (!sesionIniciada) {
    // mostrar el inicio de sesion
    return (
      <div className="login-screen">
        <header>
          <h2>Los Robles - Inicio de sesión</h2>
        </header>
        <main className="login-container">
          <div className="card">
            <h2>Residencial Los Robles</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Correo Electrónico:</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@losrobles.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input type="password" required placeholder="*****" />
              </div>
              <button type="submit" className="btn-primary">
                Iniciar sesión
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    // barra de navegación para los distintos paneles que queda cada uno con su historia de usuario.
    <div className="dashboard">
      <header className="navbar">
        <h2>Los Robles - Panel de Administración</h2>
        <div>
          <span>{correo}</span>
          <button
            className="btn-logout"
            onClick={() => setSesionIniciada(false)}
          >
            Salir
          </button>
        </div>
      </header>
      <nav className="tab-menu">
        <button
          className="btn-secondary"
          onClick={() => setVistaActual("dashboard")}
        >
          Dashboard
        </button>
        <button
          className="btn-secondary"
          onClick={() => setVistaActual("reportes")}
        >
          Reportes
        </button>
        <button
          className="btn-secondary"
          onClick={() => setVistaActual("usuarios")}
        >
          Usuarios
        </button>
        <button
          className="btn-secondary"
          onClick={() => setVistaActual("quejas")}
        >
          Quejas
        </button>
        <button
          className="btn-secondary"
          onClick={() => setVistaActual("anuncios")}
        >
          Anuncios
        </button>
        <button
          className="btn-secondary"
          onClick={() => setVistaActual("pagos")}
        >
          Pagos
        </button>
        <button
          className="btn-secondary"
          onClick={() => setVistaActual("manual")}
        >
          Manual PDF
        </button>
      </nav>

      <main className="main-content">
        {/* vista principal del panel de administración */}
        {vistaActual === "dashboard" && (
          <section className="card">
            <h3>Dashboard financiero</h3>
            <p>Resumen del estado financiero de Residencial Los Robles.</p>
            <div className="metricas">
              <div>
                <span>Saldo disponible</span>
                <strong>$8,300</strong>
              </div>
              <div>
                <span>Ingresos del mes</span>
                <strong>$24,500</strong>
              </div>
              <div>
                <span>Gastos del mes</span>
                <strong>$16,200</strong>
              </div>
              <div>
                <span>Quejas abiertas</span>
                <strong>
                  {quejas.filter((queja) => queja.estado !== "Resuelto").length}
                </strong>
              </div>
            </div>
            <p>Última actualización: hoy a las 10:30 h.</p>
            <button className="btn-primary" onClick={descargarPDF}>
              Descargar reporte financiero PDF
            </button>
          </section>
        )}
        {vistaActual === "reportes" && (
          // reportes financieros
          <section className="card">
            <h3>Reportes financieros</h3>
            <table className="tabla-pagos">
              <tbody>
                <tr>
                  <td>Ingresos por cuotas</td>
                  <td>$24,500</td>
                </tr>
                <tr>
                  <td>Gastos de mantenimiento</td>
                  <td>$16,200</td>
                </tr>
                <tr>
                  <th>Saldo disponible</th>
                  <th>$8,300</th>
                </tr>
              </tbody>
            </table>
            <button className="btn-primary" onClick={exportarReporte}>
              Exportar reporte CSV
            </button>
          </section>
        )}
        {vistaActual === "usuarios" && (
          // manejo de usuarios
          <section className="card">
            <h3>Gestión de usuarios</h3>
            <form className="form-pago" onSubmit={agregarUsuario}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  value={nuevoUsuario.nombre}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      nombre: e.target.value,
                    })
                  }
                  placeholder="Nombre del usuario"
                  required
                />
              </div>
              <div className="form-group">
                <label>Correo:</label>
                <input
                  type="email"
                  value={nuevoUsuario.correo}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      correo: e.target.value,
                    })
                  }
                  placeholder="usuario@losrobles.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select
                  className="select-rol"
                  value={nuevoUsuario.rol}
                  onChange={(e) =>
                    setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
                  }
                >
                  <option>Residente</option>
                  <option>Administrador</option>
                </select>
              </div>
              <button className="btn-primary" type="submit">
                Añadir usuario
              </button>
            </form>
            <table className="tabla-pagos">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      <button
                        className="btn-secondary"
                        type="button"
                        onClick={() => eliminarUsuario(usuario.id)}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {vistaActual === "quejas" && (
          // modulo de quejas
          <section className="card">
            <h3>Quejas e incidencias</h3>
            <form className="form-pago" onSubmit={registrarQueja}>
              <div className="form-group">
                <label>Describe tu queja:</label>
                <input
                  value={nuevaQueja}
                  onChange={(e) => setNuevaQueja(e.target.value)}
                  placeholder="Describe brevemente el problema"
                  required
                />
              </div>
              <div className="form-group">
                <label>Fotografía:</label>
                <input type="file" accept="image/*" />
              </div>
              <button className="btn-primary" type="submit">
                Enviar reporte
              </button>
            </form>
            <table className="tabla-pagos">
              <thead>
                <tr>
                  <th>Reporte</th>
                  <th>Estatus</th>
                  <th>Actualizar</th>
                </tr>
              </thead>
              <tbody>
                {quejas.map((queja) => (
                  <tr key={queja.id}>
                    <td>{queja.asunto}</td>
                    <td>
                      <span className="badge">{queja.estado}</span>
                    </td>
                    <td>
                      <select
                        value={queja.estado}
                        onChange={(e) =>
                          actualizarQueja(queja.id, e.target.value)
                        }
                      >
                        <option>Abierto</option>
                        <option>En revisión</option>
                        <option>Resuelto</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
        {vistaActual === "anuncios" && (
          // modulo de anuncios
          <section className="card">
            <h3>Tablón de anuncios y alertas</h3>
            <div className="anuncio">
              <strong>Alerta urgente</strong>
              <p>
                El suministro de agua tendrá mantenimiento mañana de 9:00 a
                12:00 h.
              </p>
            </div>
            <div className="anuncio">
              <strong>Reunión vecinal</strong>
              <p>
                La próxima reunión será el sábado a las 18:00 h en el salón
                comunitario.
              </p>
            </div>
          </section>
        )}
        {vistaActual === "manual" && (
          // descarga de manuales
          <section className="card">
            <h3>Manual de usuario</h3>
            <p>
              Consulta las instrucciones básicas para usar el dashboard,
              registrar quejas y revisar anuncios.
            </p>
            <button className="btn-primary" onClick={descargarPDF}>
              Descargar manual PDF
            </button>
          </section>
        )}
        {vistaActual === "pagos" && (
          // procesador de pagos
          <>
            <section className="card">
              <h3>Realizar Pago de Cuota</h3>
              <form onSubmit={handlePagar} className="form-pago">
                <div className="form-group">
                  <label>Concepto:</label>
                  <input
                    value={conceptoPago}
                    onChange={(e) => setConceptoPago(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Monto ($ MXN):</label>
                  <input
                    type="number"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Número de Tarjeta:</label>
                  <input
                    type="text"
                    placeholder="4152 •••• •••• 1234"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Pagar Ahora
                </button>
              </form>
            </section>
            <section className="card">
              <h3>Historial de Pagos y Adeudos</h3>
              <table className="tabla-pagos">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Monto</th>
                    <th>Fecha</th>
                    <th>Estatus</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.id}>
                      <td>{pago.concepto}</td>
                      <td>{pago.monto}</td>
                      <td>{pago.fecha}</td>
                      <td>
                        <span className="badge">{pago.estatus}</span>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          onClick={descargarPDF}
                        >
                          Descargar PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
