import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados de datos
  const [dashboardData, setDashboardData] = useState([]);
  const [clases, setClases] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [estudiantesInscritos, setEstudiantesInscritos] = useState([]);

  // Estados de formularios
  const [formEstudiante, setFormEstudiante] = useState({ nombre: '', apellido: '', email: '' });
  const [formInstructor, setFormInstructor] = useState({ nombre: '', apellido: '', especialidad: '' });
  const [formClase, setFormClase] = useState({ nombre: '', instructor_id: '', horario: '', capacidad: '' });
  const [formInscripcion, setFormInscripcion] = useState({ estudiante_id: '', clase_id: '' });
  const [formAsistencia, setFormAsistencia] = useState({ estudiante_id: '', clase_id: '', estado: 'Asistió' });

  // --- FUNCIONES DE CARGA ---
  const cargarDashboard = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/dashboard'); 
      if (res.ok) setDashboardData(await res.json());
    } catch (error) { console.error("Error cargando dashboard:", error); }
  };

  const cargarDatosBase = async () => {
    try {
      const [resClases, resEstudiantes, resInstructores] = await Promise.all([
        fetch('http://localhost:3000/api/clases'),
        fetch('http://localhost:3000/api/estudiantes'),
        fetch('http://localhost:3000/api/instructores')
      ]);
      if (resClases.ok) setClases(await resClases.json());
      if (resEstudiantes.ok) setEstudiantes(await resEstudiantes.json());
      if (resInstructores.ok) setInstructores(await resInstructores.json());
    } catch (error) { console.error("Error cargando datos base:", error); }
  };

  useEffect(() => {
    cargarDashboard();
    cargarDatosBase();
  }, []);

  // Cargar estudiantes filtrados para asistencia
  useEffect(() => {
    if (formAsistencia.clase_id) {
      fetch(`http://localhost:3000/api/clases/${formAsistencia.clase_id}/estudiantes`)
        .then(res => res.json())
        .then(data => setEstudiantesInscritos(data))
        .catch(err => console.error("Error cargando estudiantes:", err));
    } else {
      setEstudiantesInscritos([]);
    }
  }, [formAsistencia.clase_id]);

  // --- FUNCIONES DE ENVÍO (SUBMITS) ---
  const crearEstudiante = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/estudiantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formEstudiante)
    });
    if (res.ok) {
      alert('¡Estudiante registrado!');
      setFormEstudiante({ nombre: '', apellido: '', email: '' });
      cargarDatosBase();
    }
  };

  const crearInstructor = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/instructores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formInstructor)
    });
    if (res.ok) {
      alert('¡Instructor registrado!');
      setFormInstructor({ nombre: '', apellido: '', especialidad: '' });
      cargarDatosBase();
    }
  };

  const crearClase = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/clases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formClase)
    });
    if (res.ok) {
      alert('¡Clase creada!');
      setFormClase({ nombre: '', instructor_id: '', horario: '', capacidad: '' });
      cargarDatosBase();
    }
  };

  const inscribirEstudiante = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/inscripciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formInscripcion)
    });
    if (res.ok) {
      alert('¡Inscripción exitosa!');
      setFormInscripcion({ estudiante_id: '', clase_id: '' });
    } else {
      const err = await res.json();
      alert(`Error: ${err.error}`);
    }
  };

  const registrarAsistencia = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/asistencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formAsistencia)
    });
    if (res.ok) {
      alert('¡Registro de asistencia guardado!');
      setFormAsistencia({ estudiante_id: '', clase_id: '', estado: 'Asistió' });
      setEstudiantesInscritos([]);
      cargarDashboard();
    } else {
      const err = await res.json();
      alert(`Error: ${err.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 py-6 mb-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-600 tracking-tight flex justify-center items-center gap-3">
            DanceFlow Academy <span className="text-3xl">🕺💃</span>
          </h1>
          <Link to="/" className="text-sm text-indigo-600 hover:underline mt-2 inline-block">← Volver al sitio web</Link>
        </div>
      </header>

      {/* Navegación */}
      <nav className="max-w-4xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-3">
          {['dashboard', 'estudiante', 'instructor', 'clase', 'inscribir', 'asistencia'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-indigo-600 border border-gray-200 shadow-sm'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-5xl mx-auto px-4 pb-12">
        
        {/* VISTA: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-800">Panel de Control (Asistencias Recientes)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 border-b">Estudiante</th>
                    <th className="p-4 border-b">Clase</th>
                    <th className="p-4 border-b">Fecha</th>
                    <th className="p-4 border-b">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dashboardData.length > 0 ? (
                    dashboardData.map((fila, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{fila.estudiante_nombre}</td>
                        <td className="p-4 text-gray-600">{fila.clase_nombre}</td>
                        <td className="p-4 text-gray-500 text-sm">{new Date(fila.fecha).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            fila.estado === 'Asistió' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {fila.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400">No hay registros para mostrar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA: ESTUDIANTE */}
        {activeTab === 'estudiante' && (
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-800 text-center">Registrar Estudiante</h2>
            </div>
            <form onSubmit={crearEstudiante} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre:</label>
                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formEstudiante.nombre} onChange={e => setFormEstudiante({...formEstudiante, nombre: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido:</label>
                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formEstudiante.apellido} onChange={e => setFormEstudiante({...formEstudiante, apellido: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email:</label>
                <input type="email" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formEstudiante.email} onChange={e => setFormEstudiante({...formEstudiante, email: e.target.value})} />
              </div>
              <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors">Guardar Estudiante</button>
            </form>
          </div>
        )}

        {/* VISTA: INSTRUCTOR */}
        {activeTab === 'instructor' && (
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-800 text-center">Registrar Instructor</h2>
            </div>
            <form onSubmit={crearInstructor} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre:</label>
                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formInstructor.nombre} onChange={e => setFormInstructor({...formInstructor, nombre: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido:</label>
                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formInstructor.apellido} onChange={e => setFormInstructor({...formInstructor, apellido: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Especialidad:</label>
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formInstructor.especialidad} onChange={e => setFormInstructor({...formInstructor, especialidad: e.target.value})} />
              </div>
              <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors">Guardar Instructor</button>
            </form>
          </div>
        )}

        {/* VISTA: CLASE */}
        {activeTab === 'clase' && (
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-800 text-center">Crear Nueva Clase</h2>
            </div>
            <form onSubmit={crearClase} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Clase:</label>
                <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formClase.nombre} onChange={e => setFormClase({...formClase, nombre: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Instructor:</label>
                <select required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formClase.instructor_id} onChange={e => setFormClase({...formClase, instructor_id: e.target.value})}>
                  <option value="">-- Elige un instructor --</option>
                  {instructores.map(i => <option key={i.id} value={i.id}>{i.nombre} {i.apellido}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Horario:</label>
                <input type="text" required placeholder="Ej: Lunes 18:00" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formClase.horario} onChange={e => setFormClase({...formClase, horario: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Capacidad:</label>
                <input type="number" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formClase.capacidad} onChange={e => setFormClase({...formClase, capacidad: e.target.value})} />
              </div>
              <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors">Guardar Clase</button>
            </form>
          </div>
        )}

        {/* VISTA: INSCRIBIR */}
        {activeTab === 'inscribir' && (
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-800 text-center">Inscribir Estudiante</h2>
            </div>
            <form onSubmit={inscribirEstudiante} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estudiante:</label>
                <select required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formInscripcion.estudiante_id} onChange={e => setFormInscripcion({...formInscripcion, estudiante_id: e.target.value})}>
                  <option value="">-- Elige un estudiante --</option>
                  {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Clase:</label>
                <select required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formInscripcion.clase_id} onChange={e => setFormInscripcion({...formInscripcion, clase_id: e.target.value})}>
                  <option value="">-- Elige una clase --</option>
                  {clases.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors">Inscribir</button>
            </form>
          </div>
        )}

        {/* VISTA: ASISTENCIA */}
        {activeTab === 'asistencia' && (
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-800 text-center">Tomar Asistencia</h2>
            </div>
            <form onSubmit={registrarAsistencia} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">1. Seleccionar Clase:</label>
                <select required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formAsistencia.clase_id} onChange={(e) => setFormAsistencia({...formAsistencia, clase_id: e.target.value})}>
                  <option value="">-- Elige una clase --</option>
                  {clases.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">2. Estudiante (Inscrito sin asistencia hoy):</label>
                <select required disabled={!formAsistencia.clase_id} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                  value={formAsistencia.estudiante_id} onChange={(e) => setFormAsistencia({...formAsistencia, estudiante_id: e.target.value})}>
                  <option value="">-- Elige un estudiante --</option>
                  {estudiantesInscritos.map(e => <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado:</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formAsistencia.estado} onChange={(e) => setFormAsistencia({...formAsistencia, estado: e.target.value})}>
                  <option value="Asistió">Asistió</option>
                  <option value="Faltó">Faltó</option>
                </select>
              </div>
              <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors">Guardar Asistencia</button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminPanel;