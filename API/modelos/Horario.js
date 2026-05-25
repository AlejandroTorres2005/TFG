const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  dia: { type: String, required: true },
  hora: { type: String, required: true },
  asignatura: { type: String, required: true },
  grupo: { type: Number, required: true },
  profesor: { type: String, default: '' }
}, { collection: 'horarios' });

module.exports = mongoose.model('Horario', horarioSchema);
