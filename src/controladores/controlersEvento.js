const { Pool } = require('pg');
const { } = require('morgan');
var fs = require('fs');
const { json } = require('express');

//VARIABLE CON REFERENCIA A LA RUTA DONDE SE ALMACENAN LAS IMAGENES(ruta relativa desde ésta carpeta).
var folderImagenEventoAbs; //REEMPLAZAR CON RUTA DEL SERVIDOR

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

    folderImagenEventoAbs = config.folderImagenEventoAbs;
  }
}); 

const getEvento = (_req, res) => {
    console.log('getEvento');
    pool.query('SELECT * FROM eventos WHERE baja=false AND aprobado=true')
        .then(respuesta => {
            res.status(200).json(respuesta.rows);
        })
};

const obtenerEventosPendientes = (req, res) => {
    console.log('ObtenerEventosPendientes');
    pool.query('SELECT * FROM eventos WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createEvento = (req, res) => {
    console.log('createEvento');
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, imagenes } = req.body;

    pool.query('INSERT INTO eventos (nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, baja, imagenes) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', [nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, baja, imagenes])
        .then(respuesta => console.log(respuesta))
        .then(res.status(201).json({ message: 'Evento agregado con exito' }))
};

const deleteEvento = (req, res) => {
    console.log('deleteEvento');
    const id = req.params.id
    pool.query('SELECT imagenes FROM eventos WHERE id =$1', [id])
        .then((query) => {
            for (let index = 0; index < query.rows[0].imagenes.length; index++) {
                const queryPath = pool.query('SELECT * FROM imagenes WHERE id = $1', [query.rows[0].imagenes[index]])
                    .then((queryPath) => {
                        pathImagen = folderImagenEventoAbs + nameFromPath(queryPath.rows[0].ruta);
                        fs.unlink(pathImagen);
                    })
            }
        })


    pool.query('SELECT * FROM eventos WHERE id =$1', [id])
        .then((respuesta) => {
            pool.query('UPDATE horarios SET baja=true WHERE id=$1', [respuesta.rows[0].idhorario])
            for (let index = 0; index < respuesta.rows[0].imagenes.length; index++) {
                pool.query('UPDATE imagenes SET baja=true WHERE id=$1', [respuesta.rows[0].imagenes[index]]);
            };
        })
    pool.query('UPDATE eventos SET baja=true WHERE id=$1', [id])
        .then(respu => console.log(respu))
        .then(res.status(200));
};

const updateEvento = (req, res) => {
    console.log('updateEvento');
    const id = req.params.id;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, aprobado, lat, long, imagenes } = req.body;
    pool.query('UPDATE eventos SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5 , provincia= $6, localidad=$7, fechainicio=$8, fechafin=$9, horaapertura=$10, horacierre=$11, email=$12, precio=$13, aprobado=$15, lat=$16, long=$17, imagenes=$18  WHERE id=$14', [nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, id, aprobado, lat, long, imagenes])
        .then(respuesta => console.log(respuesta))
        .then(res.status(200).send());
};



module.exports = {
    getEvento,
    createEvento,
    deleteEvento,
    updateEvento,
    obtenerEventosPendientes,
}