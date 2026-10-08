import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';



function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados de datos
  const [dashboardData, setDashboardData] = useState([]);
  const [clases, setClases] = useState([]);
  const [editandoClaseId, setEditandoClaseId] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [editandoEstudianteId, setEditandoEstudianteId] = useState(null);
  const [instructores, setInstructores] = useState([]);
  const [editandoInstructorId, setEditandoInstructorId] = useState(null);
  const [estudiantesInscritos, setEstudiantesInscritos] = useState([]);
 
 



  // Estados de formularios
  const [formEstudiante, setFormEstudiante] = useState({ nombre: '', apellido: '', email: '' });
  const [formInstructor, setFormInstructor] = useState({ nombre: '', apellido: '', especialidad: '' });
  const [formClase, setFormClase] = useState({ nombre: '', instructor_id: '', dia_semana: '', horario: '', capacidad: '' });
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
const guardarEstudiante = async (e) => {
  e.preventDefault();
  const url = editandoEstudianteId 
    ? `http://localhost:3000/api/estudiantes/${editandoEstudianteId}` 
    : 'http://localhost:3000/api/estudiantes';
  const method = editandoEstudianteId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formEstudiante)
    });

    if (res.ok) {
      toast.success(editandoEstudianteId ? '¡Estudiante actualizado!' : '¡Estudiante registrado!');
      cancelarEdicionEstudiante();
      cargarDatosBase();
    } else {
      const err = await res.json();
      toast.error(`Error: ${err.error || 'No se pudo guardar'}`);
    }
  } catch (error) {
    toast.error('Error de conexión con el servidor');
  }
};

const cancelarEdicionEstudiante = () => {
  setFormEstudiante({ nombre: '', apellido: '', email: '' });
  setEditandoEstudianteId(null);
};

const eliminarEstudiante = async (id) => {
  if (!window.confirm('¿Eliminar este estudiante?')) return;
  try {
    const res = await fetch(`http://localhost:3000/api/estudiantes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Estudiante eliminado correctamente');
      cargarDatosBase();
    } else {
      toast.error('No se pudo eliminar el estudiante');
    }
  } catch (error) {
    toast.error('Error de conexión');
  }
};

const guardarInstructor = async (e) => {
  e.preventDefault();
  const url = editandoInstructorId 
    ? `http://localhost:3000/api/instructores/${editandoInstructorId}` 
    : 'http://localhost:3000/api/instructores';
  const method = editandoInstructorId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formInstructor)
    });

    if (res.ok) {
      toast.success(editandoInstructorId ? '¡Instructor actualizado!' : '¡Instructor registrado!');
      cancelarEdicionInstructor();
      cargarDatosBase();
    } else {
      const err = await res.json();
      toast.error(`Error: ${err.error || 'No se pudo guardar'}`);
    }
  } catch (error) {
    toast.error('Error de conexión');
  }
};

const cancelarEdicionInstructor = () => {
  setFormInstructor({ nombre: '', apellido: '', especialidad: '' });
  setEditandoInstructorId(null);
};

const eliminarInstructor = async (id) => {
  if (!window.confirm('¿Eliminar este instructor?')) return;
  try {
    const res = await fetch(`http://localhost:3000/api/instructores/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Instructor eliminado correctamente');
      cargarDatosBase();
    } else {
      toast.error('No se pudo eliminar el instructor');
    }
  } catch (error) {
    toast.error('Error de conexión');
  }
};

const guardarClase = async (e) => {
  e.preventDefault();
  const url = editandoClaseId 
    ? `http://localhost:3000/api/clases/${editandoClaseId}` 
    : 'http://localhost:3000/api/clases';
  const method = editandoClaseId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formClase)
    });

    if (res.ok) {
      toast.success(editandoClaseId ? '¡Clase actualizada!' : '¡Clase registrada!');
      cancelarEdicionClase();
      cargarDatosBase();
    } else {
      const err = await res.json();
      toast.error(`Error: ${err.error || 'No se pudo guardar'}`);
    }
  } catch (error) {
    toast.error('Error de conexión');
  }
};

const eliminarClase = async (id) => {
  if (!window.confirm('¿Eliminar esta clase?')) return;
  try {
    const res = await fetch(`http://localhost:3000/api/clases/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Clase eliminada correctamente');
      cargarDatosBase();
    } else {
      toast.error('No se pudo eliminar la clase');
    }
  } catch (error) {
    toast.error('Error de conexión');
  }
};

const cancelarEdicionClase = () => {
  setFormClase({ nombre: '', instructor_id: '', dia_semana: '', horario: '', capacidad: '' });
  setEditandoClaseId(null);
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
          <Toaster position="top-right" reverseOrder={false} />
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
                    {dashboardData && dashboardData.length > 0 ? (
                      dashboardData.map(registro => (
                        <tr key={registro.id} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-800">
                            {registro.estudiante_nombre} {registro.estudiante_apellido}
                          </td>
                          <td className="p-4 text-gray-600">{registro.clase_nombre}</td>
                          <td className="p-4 text-gray-600">
                            {/* Esto formatea la fecha para que se vea corta (ej. 2026-10-06) */}
                            {registro.fecha ? registro.fecha.split('T')[0] : ''}
                          </td>
                          <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    registro.estado === 'Asistió' || registro.estado === 'Presente' 
                                              ? 'bg-green-100 text-green-700' 
                                          : 'bg-red-100 text-red-700'
        }`}>
          {registro.estado}
                                    </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-gray-500">
                          No hay registros para mostrar.
                        </td>
                      </tr>
                    )}
                  </tbody>
              </table>
            </div>
          </div>
        )}

{/* VISTA: ESTUDIANTE */}
        {activeTab === 'estudiante' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Formulario (Ocupa 1 columna) */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-fit">
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                <h2 className="text-xl font-bold text-indigo-800 text-center">
                  {editandoEstudianteId ? 'Editar Estudiante' : 'Registrar Estudiante'}
                </h2>
              </div>
              <form onSubmit={guardarEstudiante} className="p-6 space-y-5">
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
                
                {/* Botones de acción dinámicos */}
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors">
                    {editandoEstudianteId ? 'Actualizar' : 'Guardar'}
                  </button>
                  {editandoEstudianteId && (
                    <button type="button" onClick={cancelarEdicionEstudiante} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg shadow-md transition-colors">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Tabla de Registros (Ocupa 2 columnas) */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Estudiantes Registrados</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider border-b">
                      <th className="p-4">Nombre Completo</th>
                      <th className="p-4">Email</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {estudiantes.length > 0 ? (
                      estudiantes.map((est) => (
                        <tr key={est.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-800">{est.nombre} {est.apellido}</td>
                          <td className="p-4 text-gray-600">{est.email || 'N/A'}</td>
                          <td className="p-4 text-center space-x-2">
                            {/* Botón Editar */}
                           <button 
  onClick={() => { 
    setFormEstudiante({ 
      nombre: est.nombre || '', 
      apellido: est.apellido || '', 
      email: est.email || '' 
    }); 
    setEditandoEstudianteId(est.id); 
  }} 
  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold"
>
  Editar
</button>
                            {/* Botón Eliminar */}
                            <button 
                              onClick={() => eliminarEstudiante(est.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-semibold text-sm transition-colors"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="p-8 text-center text-gray-400">No hay estudiantes registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VISTA: INSTRUCTOR */}
        {activeTab === 'instructor' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-fit">
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                <h2 className="text-xl font-bold text-indigo-800 text-center">{editandoInstructorId ? 'Editar Instructor' : 'Registrar Instructor'}</h2>
              </div>
              <form onSubmit={guardarInstructor} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre:</label>
                  <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" value={formInstructor.nombre} onChange={e => setFormInstructor({...formInstructor, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido:</label>
                  <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" value={formInstructor.apellido} onChange={e => setFormInstructor({...formInstructor, apellido: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Especialidad:</label>
                  <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" value={formInstructor.especialidad} onChange={e => setFormInstructor({...formInstructor, especialidad: e.target.value})} />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md">{editandoInstructorId ? 'Actualizar' : 'Guardar'}</button>
                  {editandoInstructorId && <button type="button" onClick={cancelarEdicionInstructor} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg shadow-md">Cancelar</button>}
                </div>
              </form>
            </div>
            <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200"><h2 className="text-xl font-bold text-gray-800">Instructores</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-gray-100 text-gray-600 text-sm uppercase border-b"><th className="p-4">Nombre</th><th className="p-4">Especialidad</th><th className="p-4 text-center">Acciones</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {instructores.map(inst => (
                      <tr key={inst.id} className="hover:bg-gray-50">
                        <td className="p-4">{inst.nombre} {inst.apellido}</td>
                        <td className="p-4">{inst.especialidad}</td>
                        <td className="p-4 text-center space-x-2">
<button 
  onClick={() => { 
    setFormInstructor({ 
      nombre: inst.nombre || '', 
      apellido: inst.apellido || '', 
      especialidad: inst.especialidad || '' 
    }); 
    setEditandoInstructorId(inst.id); 
  }} 
  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold"
>
  Editar
</button>
                          <button onClick={() => eliminarInstructor(inst.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VISTA: CLASE */}
        {activeTab === 'clase' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-fit">
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                <h2 className="text-xl font-bold text-indigo-800 text-center">{editandoClaseId ? 'Editar Clase' : 'Registrar Clase'}</h2>
              </div>
             <form onSubmit={guardarClase} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Clase:</label>
                  <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formClase.nombre} onChange={e => setFormClase({...formClase, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Instructor:</label>
                  <select required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formClase.instructor_id} onChange={e => setFormClase({...formClase, instructor_id: e.target.value})}>
                    <option value="">Seleccione un instructor...</option>
                    {instructores.map(inst => <option key={inst.id} value={inst.id}>{inst.nombre} {inst.apellido}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Día de la semana:</label>
                  <select required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formClase.dia_semana} onChange={e => setFormClase({...formClase, dia_semana: e.target.value})}>
                    <option value="">Seleccione un día...</option>
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miércoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Horario (Hora de inicio):</label>
                  
                  <input type="time" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer" 
                    value={formClase.horario} onChange={e => setFormClase({...formClase, horario: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Capacidad Máxima:</label>
                  
                  <input type="number" min="1" required className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={formClase.capacidad} onChange={e => setFormClase({...formClase, capacidad: e.target.value})} />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors">
                    {editandoClaseId ? 'Actualizar' : 'Guardar'}
                  </button>
                  {editandoClaseId && (
                    <button type="button" onClick={cancelarEdicionClase} className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg shadow-md transition-colors">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200"><h2 className="text-xl font-bold text-gray-800">Clases</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm uppercase border-b">
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Día</th>
                      <th className="p-4">Horario</th>
                      <th className="p-4">Capacidad</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {clases.map(clase => (
                      <tr key={clase.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium">{clase.nombre}</td>
                        <td className="p-4">{clase.dia_semana}</td>
                        <td className="p-4">{clase.horario}</td>
                        <td className="p-4">{clase.capacidad}</td>
                        <td className="p-4 text-center space-x-2">
                          <button onClick={() => { 
                            setFormClase({ nombre: clase.nombre, instructor_id: clase.instructor_id, dia_semana: clase.dia_semana || '', horario: clase.horario, capacidad: clase.capacidad }); 
                            setEditandoClaseId(clase.id); 
                          }} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-semibold">Editar</button>
                          <button onClick={() => eliminarClase(clase.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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