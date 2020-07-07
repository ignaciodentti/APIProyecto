const {Router} = require('express');
const router = Router();
<<<<<<< HEAD
const {getPDI, obtenerPorNombre, obtenerPorCategoria, createPDI, getPDIByID, deletePDI, updatePDI, getEvento, getEventosPorNombre, getEventosPorCategoria, createEvento, deleteEvento, updateEvento, login, rutasegura, ensureToken} =require('../controladores/index.controlers');
=======

const {getPDI, obtenerPorNombre, obtenerPorCategoria, createPDI, getPDIByID, deletePDI, updatePDI, getEvento, createEvento, deleteEvento, updateEvento, signin,signup, profile} =require('../controladores/index.controlers');

>>>>>>> aeb41f8a230d8a7f7421933528cb5834c78c3926

router.get('/pdi/get/', getPDI);
router.get('/pdi/nombre/:name', obtenerPorNombre);
router.get('/pdi/getPorCategoria/:category', obtenerPorCategoria);
router.post('/pdi/post/', createPDI);
router.get('/pdi/getid/:id', getPDIByID);
router.delete('/pdi/delete/:id', deletePDI);
router.put('/pdi/put/:id', updatePDI);

router.get('/evento/get/', getEvento);
router.get('/evento/getPorNombre/:name', getEventosPorNombre);
router.get('/evento/getPorCategoria/:category', getEventosPorCategoria);
router.post('/evento/post/', createEvento);
router.delete('/evento/delete/:id', deleteEvento);
router.put('/evento/update/:id', updateEvento);
router.post('/auth/signin/', signin);
router.post('/auth/signup/', signup);
router.get('/auths/profile/',profile);
module.exports= router;