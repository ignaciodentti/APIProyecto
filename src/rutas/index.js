const {Router} = require('express');
const router = Router();

const {
    getPDI, 
    obtenerPDIPorNombre, 
    obtenerPDIPorCategoria,
    createPDI, 
    getPDIByID, 
    deletePDI, 
    updatePDI, 
    getEvento, 
    getEventosPorNombre, 
    getEventosPorCategoria, 
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
router.get('/pdi/nombre/:name', obtenerPDIPorNombre);
router.get('/pdi/getPorCategoria/:category', obtenerPDIPorCategoria);
router.post('/pdi/post/', createPDI);
router.get('/pdi/getid/:id', getPDIByID);
router.delete('/pdi/delete/:id', deletePDI);
router.put('/pdi/put/:id', updatePDI);
router.get('/pdi/getPendientes', obtenerPDIPendientes);

// eventos
router.get('/evento/get/', getEvento);
router.get('/evento/getPorNombre/:name', getEventosPorNombre);
router.get('/evento/getPorCategoria/:category', getEventosPorCategoria);
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
router.post('/auth/signin/', signin);
router.post('/auth/signup/', signup);
router.get('/auth/profile/',tokenValidation,profile);

module.exports= router;