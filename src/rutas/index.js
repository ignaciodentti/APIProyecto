const {Router} = require('express');
const router = Router();
const {getPDI, createPDI, getPDIByID, deletePDI, updatePDI} =require('../controladores/index.controlers');

router.get('/', getPDI);
router.post('/', createPDI);
router.get('/:id', getPDIByID);
router.delete('/:id', deletePDI);
router.put('/:id', updatePDI);



module.exports= router;
