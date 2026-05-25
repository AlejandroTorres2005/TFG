const Clase = require('../modelos/Clase');

async function getClases(req, res) {
  try {
    const clases = await Clase.find();
    res.status(200).json(clases);
  } catch (err) {
    console.error("Error en getClases:", err.message);
    res.status(500).json({"error":"Error al obtener las clases"});
  }
}

async function getClase(req, res) {
  try {
    const clase = await Clase.findById(req.params.id);
    if (!clase) return res.status(404).json({"status":"Error clase no encontrada"});
    res.status(200).json(clase);
  } catch (err) {
    console.error("Error en getClase:", err.message);
    res.status(500).json({"status":"Error al obtener la clase"});
  }
}

async function crearClase(req, res) {
  try {
    const newClase = new Clase(req.body);
    await newClase.save();
    res.status(201).json(newClase);
  } catch (err) {
    console.error("Error en crearClase:", err.message);
    res.status(400).json({"status":"Error al crear la clase"});
  }
}

async function actualizarClase(req, res) {
  try {
    const updatedClase = await Clase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedClase) return res.status(404).json({"status":"Error clase no encontrada"});
    res.status(200).json(updatedClase);
  } catch (err) {
    console.error("Error en actualizarClase:", err.message);
    res.status(400).json({"status":"Error al actualizar la clase"});
  }
}

async function eliminarClase(req, res) {
  try {
    const deletedClase = await Clase.findByIdAndDelete(req.params.id);
    if (!deletedClase) return res.status(404).json({"status":"Error clase no encontrada"});
    res.status(200).json({"status":"operación realizada"});
  } catch (err) {
    console.error("Error en eliminarClase:", err.message);
    res.status(500).json({"status":"Error al eliminar la clase"});
  }
}

module.exports = { getClases, getClase, crearClase, actualizarClase, eliminarClase };
