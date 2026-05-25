const Profesor = require('../modelos/Profesor');

async function getProfesores(req, res) {
  try {
    let query = Profesor.find();
    if (req.query.sinFoto === 'true') query = query.select('-foto');
    const profesores = await query;
    res.status(200).json(profesores);
  } catch (err) {
console.error("Error en getProfesores:", err.message);

    res.status(500).json({"error":"Error al obtener los profesores"});
  }
}

async function getProfesor(req, res) {
  try {
    const profesor = await Profesor.findById(req.params.id);
    if (!profesor) return res.status(404) .json({"status":"Error profesor no encontrado"});
    res.status(200).json(profesor);
  } catch (err) {
    console.error("Error en getProfesor:", err.message);
    res.status(500).json({"status":"Error al obtener el profesor"});

  }
}


async function crearProfesor(req, res) {
  try {
    const newProfesor = new Profesor(req.body);
    await newProfesor.save();
    res.status(201).json(newProfesor);
  } catch (err) {
    console.error("Error en crearProfesor:", err.message);
    res.status(400).json({"status":"Error al crear el profesor", "detalle": err.message});

  }
}

async function actualizarProfesor(req, res) {
  try {
    const updatedProfesor = await Profesor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Para devolver el profesor actualizado
    );
    if (!updatedProfesor) return res.status(404).json({"status":"Error profesor no encontrado"});
    res.status(200).json(updatedProfesor);
  } catch (err) {
    console.error("Error en actualizarProfesor:", err.message);
    res.status(400).json({"status":"Error al actualizar el profesor"});
  }
}

async function eliminarProfesor(req, res) {
  try {
    const deletedProfesor = await Profesor.findByIdAndDelete(req.params.id);
    if (!deletedProfesor) return res.status(404).json({"status":"Error profesor no encontrado"});
    res.status(200).json({"status":"operación realizada"});
  } catch (err) {
    console.error("Error en actualizarProfesor:", err.message);
    res.status(500).json({"status":"Error al eliminar el profesor"});
  }
}

module.exports = { getProfesores, getProfesor, crearProfesor, actualizarProfesor, eliminarProfesor };