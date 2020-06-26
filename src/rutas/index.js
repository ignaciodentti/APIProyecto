const {Router} = require('express');
const router = Router();
const {getPDI, createPDI, getPDIByID, deletePDI, updatePDI} =require('../controladores/index.controlers');

router.get('/get/', getPDI);
router.post('/post/', createPDI);
router.get('/getid/:id', getPDIByID);
router.delete('/delete/:id', deletePDI);
router.put('/put/:id', updatePDI);

module.exports= router;