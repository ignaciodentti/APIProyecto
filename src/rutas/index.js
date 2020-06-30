const {Router} = require('express');
const router = Router();
const {getPDI, createPDI, getPDIByID, deletePDI, updatePDI, getEvento, createEvento} =require('../controladores/index.controlers');

router.get('/get/', getPDI);
router.post('/post/', createPDI);
router.get('/getid/:id', getPDIByID);
router.delete('/delete/:id', deletePDI);
router.put('/put/:id', updatePDI);
router.get('/getevento/', getEvento);
router.post('/postEvento/', createEvento);

module.exports= router;