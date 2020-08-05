const {Router, static} = require('express');
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
    getCategoria,
    createCategoria,
    deleteCategoria,
    getSubcategoria,
    obtenerPDIPendientes,
    obtenerEventosPendientes,
    getImagenes,
    postImagenes
} =require('../controladores/index.controlers');



const {tokenValidation} = require('../libs/verificarToken')

// puntos de interés
router.get('/pdi/get/', tokenValidation, getPDI);
router.get('/pdi/categoria/:category', tokenValidation, obtenerPDIPorCategoria);
router.get('/pdi/getid/:id', getPDIByID);
router.post('/pdi/post/', tokenValidation,createPDI);
router.delete('/pdi/delete/:id',tokenValidation, deletePDI);
router.put('/pdi/put/:id',tokenValidation, updatePDI);
router.get('/pdi/getPendientes',tokenValidation, obtenerPDIPendientes);

// eventos
router.get('/evento/get/',tokenValidation ,getEvento);
router.get('/evento/categoria/:category',tokenValidation, obtenerEventosPorCategoria);
router.post('/evento/post/', tokenValidation, createEvento);
router.delete('/evento/delete/:id',tokenValidation, deleteEvento);
router.put('/evento/update/:id',tokenValidation, updateEvento);
router.get('/evento/getPendientes',tokenValidation, obtenerEventosPendientes);

// categorias
router.get('/categoria/get/', getCategoria);
router.post('/categoria/post/', createCategoria);
router.delete('/categoria/delete/:id', deleteCategoria);
router.get('/subcategoria/get/', getSubcategoria);

// autorización
router.post('/auth/signin/', signin);
router.post('/auth/signup/', signup);

//imagenes
router.get('/', getImagenes);

router.post('/upload', postImagenes);

module.exports= router;