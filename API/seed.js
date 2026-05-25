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

    const hashedUser = await bcrypt.hash('alumno', 10);
    const existingUser = await Usuario.findOne({ codigo: 'Alumno' });
    if (existingUser) {
      existingUser.clave = hashedUser;
      existingUser.perfil = 'Usuario';
      await existingUser.save();
      console.log('Usuario alumno actualizado (Alumno / alumno)');
    } else {
      await Usuario.create({ codigo: 'Alumno', nombre: 'Alumno', email: 'alumno@alumno.com', clave: hashedUser, perfil: 'Usuario' });
      console.log('Usuario alumno creado (Alumno / alumno)');
    }

    console.log('Seed completado');
    process.exit(0);
  } catch (err) {
    console.error('Error en seed:', err);
    process.exit(1);
  }
}

seed();
