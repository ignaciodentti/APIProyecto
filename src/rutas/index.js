const {Router} = require('express');
const router = Router();
const {getPDI, createPDI, getPDIByID, deletePDI, updatePDI} =require('../controladores/index.controlers');

//router.get('/', getPDI);
router.post('/pdi', createPDI);
//router.get('/pdi/:id', getPDIByID);
//router.delete('/pdi/:id', deletePDI);
//router.put('/pdi/:id', updatePDI);



module.exports= router;
