const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGOURL = "mongodb://root:example@localhost:27017/unamuno?authSource=admin";

const Usuario = require('./modelos/Usuario.js');

async function seed() {
  try {
    await mongoose.connect(MONGOURL);
    console.log('Conectado a MongoDB');

    const hashed = await bcrypt.hash('admin', 10);
    const existing = await Usuario.findOne({ codigo: 'admin' });
    if (existing) {
      existing.clave = hashed;
      existing.perfil = 'Admin';
      await existing.save();
      console.log('Usuario admin actualizado (Unamuno / Unamuno123*)');
    } else {
      await Usuario.create({ codigo: 'Unamuno', nombre: 'Unamuno', email: 'unamuno@admin.com', clave: hashed, perfil: 'Unamuno' });
      console.log('Usuario admin creado (Unamuno / Unamuno123*)');
    }

    console.log('Seed completado');
    process.exit(0);
  } catch (err) {
    console.error('Error en seed:', err);
    process.exit(1);
  }
}

seed();
