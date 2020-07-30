const {Router} = require('express');
const router = Router();

const {
    getPDI, 
    obtenerPDIPorCategoria,
    createPDI, 
    getPDIByID, 
    deletePDI, 
    updatePDI, 
    getEvento, 
    obtenerEventosPorCategoria, 
    createEvento, 
    deleteEvento, 
    updateEvento, 
    signin,
    signup, 
    profile,
    getCategoria,
    createCategoria,
    deleteCategoria,
    getSubcategoria,
    obtenerPDIPendientes,
    obtenerEventosPendientes

} =require('../controladores/index.controlers');

const {tokenValidation} = require('../libs/verificarToken')

// puntos de interés
router.get('/pdi/get/', getPDI);
router.get('/pdi/categoria/:category', obtenerPDIPorCategoria);
router.get('/pdi/getid/:id', getPDIByID);
router.post('/pdi/post/', createPDI);
router.delete('/pdi/delete/:id', deletePDI);
router.put('/pdi/put/:id',tokenValidation, updatePDI);
router.get('/pdi/getPendientes', obtenerPDIPendientes);

// eventos
router.get('/evento/get/', getEvento);
router.get('/evento/categoria/:category', obtenerEventosPorCategoria);
router.post('/evento/post/', createEvento);
router.delete('/evento/delete/:id', deleteEvento);
router.put('/evento/update/:id', updateEvento);
router.get('/evento/getPendientes', obtenerEventosPendientes);

// categorias
router.get('/categoria/get/', getCategoria);
router.post('/categoria/post/', createCategoria);
router.delete('/categoria/delete/:id', deleteCategoria);
router.get('/subcategoria/get/', getSubcategoria);

// autorización
router.get('/auth/profile/',tokenValidation,profile);
router.post('/auth/signin/', signin);
router.post('/auth/signup/', signup);

module.exports= router;