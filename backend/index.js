const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// ==========================================
// ESTUDIANTES
// ==========================================
app.get('/api/estudiantes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM estudiantes ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estudiantes' });
    }
});

app.post('/api/estudiantes', async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, nivel_actual } = req.body;
        const query = `
            INSERT INTO estudiantes (nombre, apellido, email, telefono, nivel_actual) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const result = await pool.query(query, [nombre, apellido, email, telefono, nivel_actual || 'Principiante']);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear estudiante' });
    }
});

// ELIMINAR un estudiante
app.delete('/api/estudiantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Opcional: Podrías necesitar eliminar sus asistencias o inscripciones primero 
    // dependiendo de cómo configuraste las llaves foráneas (ON DELETE CASCADE)
    const result = await pool.query('DELETE FROM estudiantes WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    
    res.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar estudiante:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ACTUALIZAR un estudiante
app.put('/api/estudiantes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email } = req.body;
    
    const result = await pool.query(
      'UPDATE estudiantes SET nombre = $1, apellido = $2, email = $3 WHERE id = $4 RETURNING *',
      [nombre, apellido, email, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    
    res.json({ message: 'Estudiante actualizado correctamente' });
  } catch (error) {
    console.error("Error al actualizar estudiante:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
// ==========================================
// INSTRUCTORES
// ==========================================

// CREAR un instructor
app.get('/api/instructores', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM instructores ORDER BY nombre ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener instructores' });
    }
});

app.post('/api/instructores', async (req, res) => {
  try {
    const { nombre, apellido, especialidad } = req.body;
    const query = `
      INSERT INTO instructores (nombre, apellido, especialidad) 
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const result = await pool.query(query, [nombre, apellido, especialidad]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error en BD al crear instructor:", error);
    // Cambiamos 'Error interno' por el error real para saber qué falla
    res.status(500).json({ error: error.message }); 
  }
});

// ACTUALIZAR un instructor
app.put('/api/instructores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, especialidad } = req.body;
    
    const query = `
      UPDATE instructores 
      SET nombre = $1, apellido = $2, especialidad = $3 
      WHERE id = $4 RETURNING *;
    `;
    const result = await pool.query(query, [nombre, apellido, especialidad, id]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Instructor no encontrado' });
    res.json({ message: 'Instructor actualizado exitosamente' });
  } catch (error) {
    console.error("Error en BD al actualizar instructor:", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/instructores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM instructores WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Instructor no encontrado' });
    res.json({ message: 'Instructor eliminado' });
  } catch (error) { res.status(500).json({ error: 'Error interno' }); }
});

// ==========================================
// CLASES
// ==========================================
app.get('/api/clases', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clases ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener clases:", error);
    res.status(500).json({ error: 'Error al obtener clases' });
  }
});

// CREAR una clase
app.post('/api/clases', async (req, res) => {
  try {
    const { nombre, instructor_id, dia_semana, horario, capacidad } = req.body;
    const instId = parseInt(instructor_id, 10);
    const cap = parseInt(capacidad, 10);

    const query = `
      INSERT INTO clases (nombre, instructor_id, dia_semana, horario, capacidad) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const result = await pool.query(query, [nombre, instId, dia_semana, horario, cap]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error en BD al crear clase:", error);
    res.status(500).json({ error: error.message });
  }
});

// ACTUALIZAR una clase
app.put('/api/clases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, instructor_id, dia_semana, horario, capacidad } = req.body;
    const instId = parseInt(instructor_id, 10);
    const cap = parseInt(capacidad, 10);

    const result = await pool.query(
      'UPDATE clases SET nombre = $1, instructor_id = $2, dia_semana = $3, horario = $4, capacidad = $5 WHERE id = $6 RETURNING *',
      [nombre, instId, dia_semana, horario, cap, id]
    );
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Clase no encontrada' });
    res.json({ message: 'Clase actualizada' });
  } catch (error) {
    console.error("Error en BD al actualizar clase:", error);
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR una clase
app.delete('/api/clases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM clases WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Clase no encontrada' });
    res.json({ message: 'Clase eliminada' });
  } catch (error) { res.status(500).json({ error: 'Error interno' }); }
});

// ==========================================
// INSCRIPCIONES (Inscribir Estudiante a Clase)
// ==========================================
app.get('/api/inscripciones', async (req, res) => {
    try {
        const query = `
            SELECT ins.id, e.nombre || ' ' || e.apellido AS estudiante, c.estilo, c.nivel, ins.fecha_inscripcion
            FROM inscripciones ins
            JOIN estudiantes e ON ins.estudiante_id = e.id
            JOIN clases c ON ins.clase_id = c.id
            ORDER BY ins.fecha_inscripcion DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener inscripciones' });
    }
});

app.post('/api/inscripciones', async (req, res) => {
    try {
        const { estudiante_id, clase_id } = req.body;
        const query = 'INSERT INTO inscripciones (estudiante_id, clase_id) VALUES ($1, $2) RETURNING *;';
        const result = await pool.query(query, [estudiante_id, clase_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: 'El estudiante ya está inscrito en esta clase o datos inválidos.' });
    }
});

app.get('/api/clases/:claseId/estudiantes', async (req, res) => {
    try {
        const { claseId } = req.params;
        const query = `
            SELECT e.id, e.nombre, e.apellido 
            FROM inscripciones ins
            JOIN estudiantes e ON ins.estudiante_id = e.id
            WHERE ins.clase_id = $1
            AND e.id NOT IN (
                SELECT estudiante_id FROM asistencias 
                WHERE clase_id = $1 AND fecha::date = CURRENT_DATE
            );
        `;
        const result = await pool.query(query, [claseId]);
        res.json(result.rows);
    } catch (error) {
        console.error("🚨 ERROR FILTRANDO ESTUDIANTES:", error.message);
        res.status(500).json({ error: 'Error al filtrar estudiantes inscritos' });
    }
});

// ==========================================
// ASISTENCIAS
// ==========================================


// Guardar asistencia validando duplicados
app.post('/api/asistencias', async (req, res) => {
    try {
        const { estudiante_id, clase_id, estado } = req.body;
        
        // Validación extra de seguridad en el backend
        const check = await pool.query(
            'SELECT id FROM asistencias WHERE estudiante_id = $1 AND clase_id = $2 AND fecha::date = CURRENT_DATE',
            [estudiante_id, clase_id]
        );
        if (check.rows.length > 0) {
            return res.status(400).json({ error: 'El estudiante ya tiene un registro de asistencia hoy en esta clase.' });
        }
        
        const query = `
            INSERT INTO asistencias (estudiante_id, clase_id, estado)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const result = await pool.query(query, [estudiante_id, clase_id, estado || 'Asistió']);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // AQUÍ ESTÁ LA CLAVE: Esto imprimirá el error real en tu terminal
        console.error("🚨 ERROR REAL EN BD:", error.message); 
        res.status(500).json({ error: 'Error interno al registrar la asistencia' });
    }
});

app.get('/api/asistencias', async (req, res) => {
    try {
        const query = `
            SELECT a.id, e.nombre || ' ' || e.apellido AS estudiante, c.estilo, c.nivel, a.fecha, a.estado
            FROM asistencias a
            JOIN estudiantes e ON a.estudiante_id = e.id
            JOIN clases c ON a.clase_id = c.id
            ORDER BY a.fecha DESC;
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener asistencias' });
    }
});

// OBTENER datos para el Dashboard (Asistencias recientes)
app.get('/api/dashboard', async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id, 
        e.nombre AS estudiante_nombre, 
        e.apellido AS estudiante_apellido, 
        c.nombre AS clase_nombre, 
        a.fecha, 
        a.estado 
      FROM asistencias a
      JOIN estudiantes e ON a.estudiante_id = e.id
      JOIN clases c ON a.clase_id = c.id
      ORDER BY a.fecha DESC 
      LIMIT 15;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en BD al cargar dashboard:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de DanceFlow corriendo en el puerto ${PORT} 🕺💃`);
});

