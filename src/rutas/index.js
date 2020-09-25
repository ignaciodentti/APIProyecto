const {Router} = require('express');
const router = Router();


//Controlador PDI
const {
    getPDI, 
    createPDI, 
    deletePDI, 
    updatePDI, 
    getEvento, 
    obtenerPDIPendientes,
    getImagenPDI,
    getImagenEvento,
    createHorarios, 
    updateHorario, 
    getHorarioByID,
    deleteImagenesPDI,
    deleteImagenesEvento,
    getPDIByID,
} =require('../controladores/controlersPDI.js');

// Controlador Eventos
const {
    getEvento, 
    createEvento, 
    deleteEvento, 
    updateEvento, 
    obtenerEventosPendientes, 
    getImagenEvento,
    deleteImagenesEvento,
} =require('../controladores/controlersEvento');

// Controlador imágenes
const {
    createImagenes, 
    uploadIMGEvento,
    uploadIMGPDI,
    getImagenPDI,
    getImagenEvento,
    devolverid,
    deleteImagenesPDI,
    deleteImagenesEvento,
} =require('../controladores/controlersImagen');

// Controlador categorías
const {
    getCategoria,
    createCategoria,
    deleteCategoria,
    getSubcategoria,
    updateCategoria,
    padreSubCategoria,
    getCategoriaByNombre,
    getCategoriaById
} =require('../controladores/controlersCategoria');

// Controlador usuarios
const {
    signin,
    signup, 
    getUsuarios,
    deleteUsuario,
    updateUsuario, 
} =require('../controladores/controlersUsuario');

// Controlador horarios
const {
    createHorarios, 
    updateHorario, 
    getHorarioByID,
} =require('../controladores/controlersHorario');


const {tokenValidation} = require('../libs/verificarToken');
const verificarToken = require('../libs/verificarToken');


// puntos de interés
router.get('/pdi/get/', tokenValidation, getPDI);
router.get('/pdi/getid/:id', getPDIByID);
router.post('/pdi/post/', tokenValidation,createPDI);
router.delete('/pdi/delete/:id',tokenValidation, deletePDI);
router.put('/pdi/put/:id',tokenValidation, updatePDI);
router.get('/pdi/getPendientes/',tokenValidation, obtenerPDIPendientes);

// eventos
router.get('/evento/get/',tokenValidation ,getEvento);
router.post('/evento/post/', tokenValidation, createEvento);
router.delete('/evento/delete/:id',tokenValidation, deleteEvento);
router.put('/evento/update/:id',tokenValidation, updateEvento);
router.get('/evento/getPendientes/',tokenValidation, obtenerEventosPendientes);

// categorias
router.get('/categoria/get/', getCategoria);
router.post('/categoria/post/', createCategoria);
router.delete('/categoria/delete/:id', deleteCategoria);
router.get('/subcategoria/get/', getSubcategoria);
router.get('/subcategoria/get/:id', padreSubCategoria);
router.put('/categoria/update/:id', updateCategoria);
router.get('/categoria/getNombre/:nombre', getCategoriaByNombre);
router.get('/categoria/getId/:id',getCategoriaById);

// autorización
router.post('/auth/signin/', signin);
router.post('/auth/signup/', signup);

//imagenes
router.get('/pdi/imagen/:idImagen', getImagenPDI); // devuelve una imagen en particular de un PDI.
router.get('/evento/imagen/:idImagen', getImagenEvento); // ditto, para un evento.
router.post('/pdi/imagenes/post/', uploadIMGPDI.single('file') , createImagenes);
router.post('/evento/imagenes/post/', uploadIMGEvento.single('file'), createImagenes);
router.get('/imagenes/getUltimoID/', devolverid);
router.put('/pdi/imagenes/delete/', deleteImagenesPDI);
router.put('/evento/imagenes/delete/', deleteImagenesEvento);

//horarios 
router.get('/horarios/get/:id',getHorarioByID);
router.post('/horarios/post/', createHorarios);
router.put('/horarios/put/:id',updateHorario);

//usuarios
router.get('/usuarios/get', getUsuarios);
router.delete('/usuarios/delete/:id', tokenValidation, deleteUsuario);
router.put('/usuarios/update/:id', tokenValidation, updateUsuario)

module.exports= router;