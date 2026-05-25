const express = require('express');
const router = express.Router();
const ControladorProfesores = require('../controladores/controladorProfesores.js');

router.get('/', ControladorProfesores.getProfesores);
router.get('/:id', ControladorProfesores.getProfesor);
router.post('/', ControladorProfesores.crearProfesor);
router.put('/:id', ControladorProfesores.actualizarProfesor);
router.delete('/:id', ControladorProfesores.eliminarProfesor);
module.exports = router;