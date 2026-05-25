const express = require('express');
const router = express.Router();
const controladorHorarios = require('../controladores/controladorHorarios');

router.get('/', controladorHorarios.getHorarios);
router.get('/:id', controladorHorarios.getHorario);
router.get('/dia/:dia', controladorHorarios.getHorariosPorDia);
router.post('/', controladorHorarios.crearHorario);
router.post('/seed', controladorHorarios.seedHorarios);
router.put('/:id', controladorHorarios.actualizarHorario);
router.delete('/:id', controladorHorarios.eliminarHorario);
module.exports = router;
