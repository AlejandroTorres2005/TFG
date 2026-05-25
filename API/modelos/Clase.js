const mongoose = require('mongoose');

const claseSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  profesor: String,
  horario: String
});

module.exports = mongoose.model('Clase', claseSchema);
