import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* Navegación Pública */}
      <nav className="border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="text-2xl font-extrabold text-indigo-600 flex items-center gap-2">
          DanceFlow <span className="text-xl">🕺💃</span>
        </div>
        <div className="hidden md:flex gap-8 items-center font-medium text-gray-600">
          <a href="#inicio" className="hover:text-indigo-600 transition-colors">Inicio</a>
          <a href="#nosotros" className="hover:text-indigo-600 transition-colors">Quiénes Somos</a>
          <a href="#clases" className="hover:text-indigo-600 transition-colors">Nuestras Clases</a>
          <Link to="/admin" className="ml-4 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-transform hover:scale-105 font-bold">
            Portal Admin
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="pt-20 pb-32 px-8 text-center bg-gradient-to-b from-indigo-50 to-white">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Encuentra tu ritmo con <span className="text-indigo-600">DanceFlow</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          La mejor academia de baile de la ciudad. Instructores profesionales, ambiente increíble y clases diseñadas para todos los niveles.
        </p>
        <a href="#clases" className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-indigo-600 transition-colors shadow-lg">
          Descubre nuestras clases
        </a>
      </section>

      {/* Quiénes Somos */}
      <section id="nosotros" className="py-20 px-8 bg-white max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Pasión es el Movimiento</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              En DanceFlow Academy creamos un espacio donde cualquier persona, sin importar su experiencia, puede expresarse a través del baile.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nuestro enfoque combina la técnica fundamental con confianza, creatividad y comunidad.
            </p>
          </div>
          <div className="bg-indigo-100 h-80 rounded-2xl flex items-center justify-center text-indigo-300 text-6xl shadow-inner border border-indigo-200">
            🎵✨
          </div>
        </div>
      </section>

      {/* Clases */}
      <section id="clases" className="py-20 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Clases Destacadas</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold mb-2">Salsa y Bachata</h3>
              <p className="text-gray-600 mb-4">Domina los ritmos latinos con técnica de pareja y expresión corporal.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">👟</div>
              <h3 className="text-xl font-bold mb-2">Danza Urbana</h3>
              <p className="text-gray-600 mb-4">Hip-hop, reggaeton y comercial dance con las coreografías más actuales.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🩰</div>
              <h3 className="text-xl font-bold mb-2">Ballet Clásico</h3>
              <p className="text-gray-600 mb-4">Flexibilidad, postura y técnica fundamental para formar bases sólidas.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">¿Gestión interna o registro de estudiantes?</p>
            <Link to="/admin" className="text-indigo-600 font-bold hover:underline">
              Ir al Panel de Administración →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <p>© 2026 DanceFlow Academy. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}