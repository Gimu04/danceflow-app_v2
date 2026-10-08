# DanceFlow Academy

DanceFlow Academy es un sistema de gestión Full-Stack diseñado para academias de baile. Centraliza la administración de estudiantes, instructores, horarios de clases, inscripciones y el registro de asistencias en una sola plataforma rápida e intuitiva. 

Este proyecto fue construido con un enfoque en la experiencia de usuario (UX), utilizando una arquitectura moderna de un sola página (SPA) y un backend robusto con base de datos relacional.

## Características Principales

- **Dashboard de Control:** Vista general con las asistencias más recientes cruzando datos en tiempo real entre estudiantes y clases.
- **Gestión de Usuarios (CRUD):** Administración completa de estudiantes e instructores (crear, leer, actualizar y eliminar) con validación de datos y prevención de errores por campos nulos.
- **Administración de Clases:** Control de la oferta académica, incluyendo horarios, días de la semana y capacidad máxima por salón.
- **Módulo de Inscripciones:** Vinculación directa de estudiantes a clases específicas para mantener el control de los cupos y la asistencia.
- **Registro de Asistencias:** Sistema optimizado para marcar la presencia de los alumnos con indicadores visuales de colores (verde para asistencia, rojo para faltas).
- **Notificaciones en Tiempo Real:** Integración de `react-hot-toast` para dar retroalimentación visual al usuario (alertas de éxito o error) sin bloquear la pantalla.

## Tecnologías Utilizadas

**Frontend:**
- React.js + Vite
- Tailwind CSS (Estilos y diseño responsivo)
- React Hot Toast (Notificaciones)

**Backend:**
- Node.js
- Express.js (API RESTful)
- CORS (Manejo de peticiones cruzadas)

**Base de Datos:**
- PostgreSQL
- `pg` (Cliente de PostgreSQL para Node.js)

## 🚀 Instalación y Uso Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/) instalado.
- [PostgreSQL](https://www.postgresql.org/) instalado y en ejecución.

### 2. Configuración de la Base de Datos
Crea una base de datos llamada `danceflow` en PostgreSQL y ejecuta este script respetando el orden para crear las tablas y sus relaciones:

```sql
CREATE TABLE clases (
    id SERIAL PRIMARY KEY, 
    nombre VARCHAR(100), 
    horario VARCHAR(50), 
    capacidad INT, 
    dia_semana VARCHAR(20)
);

CREATE TABLE instructores (
    id SERIAL PRIMARY KEY, 
    nombre VARCHAR(100), 
    apellido VARCHAR(100), 
    especialidad VARCHAR(100)
);

CREATE TABLE estudiantes (
    id SERIAL PRIMARY KEY, 
    nombre VARCHAR(100), 
    apellido VARCHAR(100), 
    email VARCHAR(100)
);

CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE,
    clase_id INT REFERENCES clases(id) ON DELETE CASCADE,
    fecha_inscripcion DATE DEFAULT CURRENT_DATE
);

CREATE TABLE asistencias (
    id SERIAL PRIMARY KEY, 
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE, 
    clase_id INT REFERENCES clases(id) ON DELETE CASCADE, 
    fecha DATE, 
    estado VARCHAR(20)
);

# Iniciar el Backend
Abre una terminal, navega a la carpeta del backend e instala las dependencias:
cd backend
npm install
npm run dev

#Iniciar el Frontend
Abre otra terminal, navega a la carpeta del frontend e instala las dependencias:
cd frontend
npm install
npm run dev


