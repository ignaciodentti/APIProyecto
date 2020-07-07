const {Router} = require('express');
const router = Router();

const {getPDI, obtenerPorNombre, createPDI, getPDIByID, deletePDI, updatePDI, getEvento, createEvento, deleteEvento, updateEvento, signin,signup, profile} =require('../controladores/index.controlers');


router.get('/pdi/get/', getPDI);
router.get('/pdi/nombre/:name', obtenerPorNombre);
router.get('/pdi/getPorCategoria/:category', obtenerPorCategoria);
router.post('/pdi/post/', createPDI);
router.get('/pdi/getid/:id', getPDIByID);
router.delete('/pdi/delete/:id', deletePDI);
router.put('/pdi/put/:id', updatePDI);
router.get('/evento/get/', getEvento);
router.post('/evento/post/', createEvento);
router.delete('/evento/delete/:id', deleteEvento);
router.put('/evento/update/:id', updateEvento);
router.post('/auth/signin/', signin);
router.post('/auth/signup/', signup);
router.get('/auths/profile/',profile);
module.exports= router;