const { Pool } = require('pg');
const multer = require("multer");
const path = require('path');
const { } = require('morgan');
var fs = require('fs');
const express = require('express');
const app = express();
const { json } = require('express');

//VARIABLES DE REFERIFAS A LAS RUTAS DONDE SE ALMACENAN LAS IMÁGENES.
var folderImagenPDI;
var folderImagenPDIAbs; //REEMPLAZAR CON RUTA DEL SERVIDOR EN ARCHIVO C:/API/.config
var folderImagenEvento;
var folderImagenEventoAbs; //REEMPLAZAR CON RUTA DEL SERVIDOR EN ARCHIVO C:/API/.config

var pool;

fs.readFile('C:/API/.config', 'utf-8', (err, data) => {
  if(err) {
    console.log('error: ', err);
  } else {
    const config = JSON.parse(data);
    pool=  new Pool({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    }); 

    folderImagenPDI = config.folderImagenPDI;
    folderImagenPDIAbs = config.folderImagenPDIAbs;
    folderImagenEvento = config.folderImagenEvento;
    folderImagenEventoAbs = config.folderImagenEventoAbs;    
  }
}); 


function nameFromPath(str) {
  return str.split('\\').pop().split('/').pop();
}

const getImagenPDI = (req, res) => {
  console.log('getImagenesPDI');
  const idImagen = req.params.idImagen;
  pool.query('SELECT * FROM imagenes WHERE id = $1', [idImagen])
      .then((queryRuta) => {
          let rutaImagen = queryRuta.rows[0].ruta;
          let nombreImagen = nameFromPath(rutaImagen);
          res.status(200).sendFile(nombreImagen, { root: './src/imagenes/PDI' });
      })
}

const getImagenEvento = (req, res) => {
  console.log('getImagenesEvento');
  const idImagen = req.params.idImagen;
  pool.query('SELECT * FROM imagenes WHERE id = $1', [idImagen])
      .then((queryRuta) => {
          let rutaImagen = queryRuta.rows[0].ruta;
          let nombreImagen = nameFromPath(rutaImagen)
          res.sendFile(nombreImagen, { root: './src/imagenes/evento' });
      })
}

const createImagenes = (req, res) => {
  console.log('CreateImagenes');
  const nombre = req.file.filename;
  rutaImg = req.file.destination + req.file.filename;
  pool.query('INSERT INTO imagenes (ruta) VALUES ($1)', [rutaImg])
      .then(respuesta => console.log(respuesta))
      .then(res.status(201).json('Imagen agregada con exito.'));
}

const getIdUltimaImagen = (req, res) => {
  console.log('GetIdUltimaImagen');
  pool.query('SELECT id FROM imagenes ORDER BY id desc limit 1')
      .then(respu => {
          res.status(200).json({
              id: respu.rows[0].id
          });
      });
}

const storagePDI = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, folderImagenPDI) },
  filename: (req, file, cb) => {
      img = Date.now() + path.extname(file.originalname).toLocaleLowerCase();
      cb(null, img);
  }
})

const storageEvento = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, folderImagenEvento) },
  filename: (req, file, cb) => {
      img = Date.now() + path.extname(file.originalname).toLocaleLowerCase();
      cb(null, img);
  }
});

const uploadIMGPDI = multer({
  storage: storagePDI,
  dest: './imagenes',
  fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const minetype = filetypes.test((file.mimetype).toLowerCase());
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (minetype && extname) { return cb(null, true); }
      cb("Error: Archivo debe ser una imagen valida");
  }
})

const uploadIMGEvento = multer({
  storage: storageEvento,
  dest: './imagenes',
  fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const minetype = filetypes.test((file.mimetype).toLowerCase());
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (minetype && extname) { return cb(null, true); }
      cb("Error: Archivo debe ser una imagen valida");
  }
})

const deleteImagenesPDI = (req, res) => {
  console.log('deleteImagenesPDI');
  let arregloID = req.body;
  for (let index = 0; index < arregloID.length; index++) {

      pool.query('SELECT * FROM imagenes WHERE id = $1', [arregloID[index]])
          .then((queryPath) => {
              pathImagen = folderImagenPDIAbs + nameFromPath(queryPath.rows[0].ruta);
              fs.unlink(pathImagen);
              pool.query('DELETE FROM imagenes WHERE id=$1', [arregloID[index]])
              .then((resp)=> console.log(resp))
          })
  }
  res.status(200).send();
}

const deleteImagenesEvento = (req, res) => {
  console.log('deleteImagenesEvento');
  let arregloID = req.body;
  for (let index = 0; index < arregloID.length; index++) {
      pool.query('SELECT * FROM imagenes WHERE id = $1', [arregloID[index]])
          .then((queryPath) => {
              pathImagen = folderImagenEventoAbs + nameFromPath(queryPath.rows[0].ruta);
              fs.unlink(pathImagen);
              pool.query('DELETE FROM imagenes WHERE id=$1', [arregloID[index]]);
          })
  }
  res.status(200).send();
}


module.exports = {
  createImagenes,
    uploadIMGEvento,
    uploadIMGPDI,
    getImagenPDI,
    getImagenEvento,
    getIdUltimaImagen,
    deleteImagenesPDI,
    deleteImagenesEvento
}