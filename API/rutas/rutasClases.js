const express = require('express');
const router = express.Router();
const ControladorClases = require('../controladores/controladorClases.js');

router.get('/', ControladorClases.getClases);
router.get('/:id', ControladorClases.getClase);
router.post('/', ControladorClases.crearClase);
router.put('/:id', ControladorClases.actualizarClase);
router.delete('/:id', ControladorClases.eliminarClase);

module.exports = router;
