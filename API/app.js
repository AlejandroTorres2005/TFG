const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const rutasProfesores = require('./rutas/rutasProfesores.js');

const rutasClases = require('./rutas/rutasClases.js');
const logger = require('./utils/logger.js')
const cookieParser = require('cookie-parser');
const connectMongo = require('connect-mongo');
const expressSession = require('express-session');
const rutasUsuarios = require('./rutas/rutasUsuarios.js');
const rutasHorarios = require('./rutas/rutasHorarios.js');
const Horario = require('./modelos/Horario.js');
const cors = require('cors');
 
const MONGOURL = "mongodb://root:example@localhost:27017/unamuno?authSource=admin";

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ["GET", "POST", "PUT", "DELETE","OPTIONS"],
  credentials:true,
}));

app.options(/.*/, cors());


// Permite recibir JSON en peticiones POST (límite 50MB para fotos base64)
app.use(express.json({ limit: '50mb' }));

// Crear un stream para escribir en el archivo de log
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Middleware de logging tipo Apache combinado
app.use(morgan('combined', { stream: logStream }));

// Gestión de sesión con cookies
app.use(cookieParser());

// Configuración de sesión
app.use(expressSession({
  secret: 'mi_clave_super_secreta',
  resave: false,
  saveUninitialized: false,
  store: connectMongo.create({
    mongoUrl: MONGOURL // aquí iría la cadena de conexión a mongo que tengas
  }),
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 3000 // 1 hora
  }
}));



// Conexión a MongoDB
mongoose.connect(MONGOURL)
  .then(async () => {
    console.log('Conectado a MongoDB');
    const total = await Horario.countDocuments();
    if (total === 0) {
      const profe = {
        1: 'Jennifer Gonzalez', 2: 'Carmen Rodriguez', 3: 'Gustavo Ramos',
        4: 'Almudena Cruz', 5: 'Eva Ortega', 6: 'Ricardo Bellido',
        7: 'Angélica Carrión', 8: 'Lorena Tendero', 9: 'Cristina Caballero',
        10: 'Lucía Felix', 11: 'Cristina Fernández', 12: 'Elena Díaz',
        13: 'Almudena Cruz', 14: 'Rosa Díaz', 15: 'Ana Roldan',
        16: 'María Borrego', 17: 'Clara Uña', 18: 'Eva Ortega',
        19: 'Cristina Fernández', 20: 'Esther García', 21: 'Susana Cabello',
        22: 'Rosa Díaz', 23: 'Cristina Blazquez', 24: 'Diana Navarro',
        25: 'Valeria Vinque', 26: 'Patricia Hernandez', 27: 'Angélica Carrión',
        28: 'Felicidad Perez'
      };
      const data = [
        { dia:"LUNES", hora:"9:30-10:15", asignatura:"EF", grupo:9, profesor:profe[9] },
        { dia:"LUNES", hora:"9:30-10:15", asignatura:"EF", grupo:11, profesor:profe[11] },
        { dia:"LUNES", hora:"10:15-11:00", asignatura:"EF", grupo:28, profesor:profe[28] },
        { dia:"LUNES", hora:"10:15-11:00", asignatura:"EF", grupo:10, profesor:profe[10] },
        { dia:"LUNES", hora:"11:00-11:45", asignatura:"EF", grupo:8, profesor:profe[8] },
        { dia:"LUNES", hora:"11:30-12:15", asignatura:"EF", grupo:1, profesor:profe[1] },
        { dia:"LUNES", hora:"11:30-12:15", asignatura:"EF", grupo:19, profesor:profe[19] },
        { dia:"LUNES", hora:"12:15-13:00", asignatura:"EF", grupo:13, profesor:profe[13] },
        { dia:"LUNES", hora:"14:30-15:15", asignatura:"EF", grupo:16, profesor:profe[16] },
        { dia:"LUNES", hora:"14:30-15:15", asignatura:"EF", grupo:25, profesor:'Lorena Dieguez' },
        { dia:"LUNES", hora:"15:15-16:00", asignatura:"EF", grupo:2, profesor:profe[2] },
        { dia:"LUNES", hora:"15:15-16:00", asignatura:"EF", grupo:4, profesor:profe[4] },
        { dia:"LUNES", hora:"9:30-10:15", asignatura:"MÚSICA", grupo:15, profesor:profe[15] },
        { dia:"LUNES", hora:"10:15-11:00", asignatura:"MÚSICA", grupo:19, profesor:profe[19] },
        { dia:"LUNES", hora:"11:00-11:45", asignatura:"MÚSICA", grupo:27, profesor:profe[27] },
        { dia:"LUNES", hora:"12:15-13:00", asignatura:"MÚSICA", grupo:1, profesor:profe[1] },
        { dia:"LUNES", hora:"14:30-15:15", asignatura:"MÚSICA", grupo:18, profesor:profe[18] },
        { dia:"LUNES", hora:"15:15-16:00", asignatura:"MÚSICA", grupo:28, profesor:profe[28] },
        { dia:"MARTES", hora:"9:30-10:15", asignatura:"EF", grupo:2, profesor:profe[2] },
        { dia:"MARTES", hora:"9:30-10:15", asignatura:"EF", grupo:25, profesor:profe[25] },
        { dia:"MARTES", hora:"10:15-11:00", asignatura:"EF", grupo:17, profesor:profe[17] },
        { dia:"MARTES", hora:"10:15-11:00", asignatura:"EF", grupo:15, profesor:profe[15] },
        { dia:"MARTES", hora:"11:30-12:15", asignatura:"EF", grupo:1, profesor:profe[1] },
        { dia:"MARTES", hora:"12:15-13:00", asignatura:"EF", grupo:3, profesor:profe[3] },
        { dia:"MARTES", hora:"12:15-13:00", asignatura:"EF", grupo:6, profesor:profe[6] },
        { dia:"MARTES", hora:"14:30-15:15", asignatura:"EF", grupo:5, profesor:profe[5] },
        { dia:"MARTES", hora:"14:30-15:15", asignatura:"EF", grupo:14, profesor:profe[14] },
        { dia:"MARTES", hora:"15:15-16:00", asignatura:"EF", grupo:9, profesor:profe[9] },
        { dia:"MARTES", hora:"15:15-16:00", asignatura:"EF", grupo:11, profesor:profe[11] },
        { dia:"MARTES", hora:"9:30-10:15", asignatura:"MÚSICA", grupo:6, profesor:profe[6] },
        { dia:"MARTES", hora:"10:15-11:00", asignatura:"MÚSICA", grupo:20, profesor:profe[20] },
        { dia:"MARTES", hora:"11:00-11:45", asignatura:"MÚSICA", grupo:9, profesor:profe[9] },
        { dia:"MARTES", hora:"12:15-13:00", asignatura:"MÚSICA", grupo:8, profesor:profe[8] },
        { dia:"MARTES", hora:"14:30-15:15", asignatura:"MÚSICA", grupo:4, profesor:profe[4] },
        { dia:"MARTES", hora:"15:15-16:00", asignatura:"MÚSICA", grupo:5, profesor:profe[5] },
        { dia:"MIÉRCOLES", hora:"9:30-10:15", asignatura:"EF", grupo:3, profesor:profe[3] },
        { dia:"MIÉRCOLES", hora:"9:30-10:15", asignatura:"EF", grupo:4, profesor:profe[4] },
        { dia:"MIÉRCOLES", hora:"10:15-11:00", asignatura:"EF", grupo:17, profesor:profe[17] },
        { dia:"MIÉRCOLES", hora:"10:15-11:00", asignatura:"EF", grupo:6, profesor:profe[6] },
        { dia:"MIÉRCOLES", hora:"11:00-11:45", asignatura:"EF", grupo:5, profesor:profe[5] },
        { dia:"MIÉRCOLES", hora:"11:30-12:15", asignatura:"EF", grupo:1, profesor:profe[1] },
        { dia:"MIÉRCOLES", hora:"12:15-13:00", asignatura:"EF", grupo:13, profesor:profe[13] },
        { dia:"MIÉRCOLES", hora:"14:30-15:15", asignatura:"EF", grupo:21, profesor:profe[21] },
        { dia:"MIÉRCOLES", hora:"14:30-15:15", asignatura:"EF", grupo:24, profesor:profe[24] },
        { dia:"MIÉRCOLES", hora:"15:15-16:00", asignatura:"EF", grupo:7, profesor:profe[7] },
        { dia:"MIÉRCOLES", hora:"15:15-16:00", asignatura:"EF", grupo:14, profesor:profe[14] },
        { dia:"MIÉRCOLES", hora:"9:30-10:15", asignatura:"MÚSICA", grupo:21, profesor:profe[21] },
        { dia:"MIÉRCOLES", hora:"10:15-11:00", asignatura:"MÚSICA", grupo:14, profesor:profe[14] },
        { dia:"MIÉRCOLES", hora:"11:00-11:45", asignatura:"MÚSICA", grupo:10, profesor:profe[10] },
        { dia:"MIÉRCOLES", hora:"12:15-13:00", asignatura:"MÚSICA", grupo:7, profesor:profe[7] },
        { dia:"MIÉRCOLES", hora:"14:30-15:15", asignatura:"MÚSICA", grupo:25, profesor:'Lorena Dieguez' },
        { dia:"MIÉRCOLES", hora:"15:15-16:00", asignatura:"MÚSICA", grupo:25, profesor:profe[25] },
        { dia:"JUEVES", hora:"9:30-10:15", asignatura:"EF", grupo:7, profesor:profe[7] },
        { dia:"JUEVES", hora:"9:30-10:15", asignatura:"EF", grupo:25, profesor:'Lorena Dieguez' },
        { dia:"JUEVES", hora:"10:15-11:00", asignatura:"EF", grupo:16, profesor:profe[16] },
        { dia:"JUEVES", hora:"10:15-11:00", asignatura:"EF", grupo:15, profesor:profe[15] },
        { dia:"JUEVES", hora:"11:00-11:45", asignatura:"EF", grupo:27, profesor:profe[27] },
        { dia:"JUEVES", hora:"11:30-12:15", asignatura:"EF", grupo:24, profesor:profe[24] },
        { dia:"JUEVES", hora:"12:15-13:00", asignatura:"EF", grupo:2, profesor:profe[2] },
        { dia:"JUEVES", hora:"12:15-13:00", asignatura:"EF", grupo:4, profesor:profe[4] },
        { dia:"JUEVES", hora:"14:30-15:15", asignatura:"EF", grupo:8, profesor:profe[8] },
        { dia:"JUEVES", hora:"14:30-15:15", asignatura:"EF", grupo:10, profesor:profe[10] },
        { dia:"JUEVES", hora:"15:15-16:00", asignatura:"EF", grupo:3, profesor:profe[3] },
        { dia:"JUEVES", hora:"15:15-16:00", asignatura:"EF", grupo:6, profesor:profe[6] },
        { dia:"JUEVES", hora:"9:30-10:15", asignatura:"MÚSICA", grupo:16, profesor:profe[16] },
        { dia:"JUEVES", hora:"10:15-11:00", asignatura:"MÚSICA", grupo:22, profesor:profe[22] },
        { dia:"JUEVES", hora:"11:00-11:45", asignatura:"MÚSICA", grupo:11, profesor:profe[11] },
        { dia:"JUEVES", hora:"12:15-13:00", asignatura:"MÚSICA", grupo:3, profesor:profe[3] },
        { dia:"JUEVES", hora:"14:30-15:15", asignatura:"MÚSICA", grupo:26, profesor:profe[26] },
        { dia:"JUEVES", hora:"15:15-16:00", asignatura:"MÚSICA", grupo:13, profesor:profe[13] },
        { dia:"VIERNES", hora:"9:30-10:15", asignatura:"EF", grupo:9, profesor:profe[9] },
        { dia:"VIERNES", hora:"9:30-10:15", asignatura:"EF", grupo:11, profesor:profe[11] },
        { dia:"VIERNES", hora:"10:15-11:00", asignatura:"EF", grupo:28, profesor:profe[28] },
        { dia:"VIERNES", hora:"10:15-11:00", asignatura:"EF", grupo:10, profesor:profe[10] },
        { dia:"VIERNES", hora:"11:00-11:45", asignatura:"EF", grupo:8, profesor:profe[8] },
        { dia:"VIERNES", hora:"11:30-12:15", asignatura:"EF", grupo:24, profesor:profe[24] },
        { dia:"VIERNES", hora:"12:15-13:00", asignatura:"EF", grupo:13, profesor:profe[13] },
        { dia:"VIERNES", hora:"14:30-15:15", asignatura:"EF", grupo:16, profesor:profe[16] },
        { dia:"VIERNES", hora:"14:30-15:15", asignatura:"EF", grupo:15, profesor:profe[15] },
        { dia:"VIERNES", hora:"15:15-16:00", asignatura:"EF", grupo:27, profesor:profe[27] },
        { dia:"VIERNES", hora:"15:15-16:00", asignatura:"EF", grupo:14, profesor:profe[14] },
        { dia:"VIERNES", hora:"9:30-10:15", asignatura:"MÚSICA", grupo:17, profesor:profe[17] },
        { dia:"VIERNES", hora:"10:15-11:00", asignatura:"MÚSICA", grupo:23, profesor:profe[23] },
        { dia:"VIERNES", hora:"11:00-11:45", asignatura:"MÚSICA", grupo:0, profesor:"" },
        { dia:"VIERNES", hora:"12:15-13:00", asignatura:"MÚSICA", grupo:2, profesor:profe[2] },
        { dia:"VIERNES", hora:"14:30-15:15", asignatura:"MÚSICA", grupo:12, profesor:profe[12] },
        { dia:"VIERNES", hora:"15:15-16:00", asignatura:"MÚSICA", grupo:24, profesor:profe[24] },
      ];
      await Horario.insertMany(data);
      console.log(`Horario automático creado (${data.length} registros)`);
    } else {
      console.log(`Horario ya existente (${total} registros)`);
    }
  })
  .catch(err => console.error('Error al conectar MongoDB', err));

app.use('/profesores', rutasProfesores);
app.use('/usuarios', rutasUsuarios);
app.use('/clases', rutasClases);
app.use('/horarios', rutasHorarios);


app.use((req, res) => {
  const userIP = req.ip;
  const method = req.method;
  const url = req.originalUrl;
  logger.info(`${userIP} - - "${method} ${url}" PETICION ERRONEA`);
  res.status(404).send('Ruta no encontrada');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));  