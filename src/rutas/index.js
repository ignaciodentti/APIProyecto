const {Router} = require('express');
const router = Router();
const {getPDI, createPDI, getPDIByID, deletePDI, updatePDI, getEvento, createEvento, deleteEvento, updateEvento, login, rutasegura, ensureToken} =require('../controladores/index.controlers');

router.get('/pdi/get/', getPDI);
router.post('/pdi/post/', createPDI);
router.get('/pdi/getid/:id', getPDIByID);
router.delete('/pdi/delete/:id', deletePDI);
router.put('/pdi/put/:id', updatePDI);
router.get('/evento/get/', getEvento);
router.post('/evento/post/', createEvento);
router.delete('/evento/delete/:id', deleteEvento);
router.put('/evento/update/:id', updateEvento);
router.post('/loginuser/', login);
router. get('/protected/', ensureToken, rutasegura)
module.exports= router;