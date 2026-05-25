const mongoose = require('mongoose');

const profesorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  clases: [String],
  foto: String,
  guardiasRealizadas: { type: Number, default: 0 },
  horasLibres: Array,
  email: String,
  telefono: Number
}, { collection: 'profesores' });

module.exports = mongoose.model('Profesor', profesorSchema);