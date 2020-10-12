const { Pool } = require('pg');
const { } = require('morgan');
var fs = require('fs');
const express = require('express');
const app = express();


//VARIABLE CON REFERENCIA A LA RUTA DONDE SE ALMACENAN LAS IMAGENES (ruta relativa desde ésta carpeta).
var folderImagenPDIAbs; //REEMPLAZAR CON RUTA DEL SERVIDOR EN ARCHIVO C:/API/.config

var pool;
fs.readFile('C:/API/.config', 'utf-8', (err, data) => {
    if (err) {
        console.log('error: ', err);
    } else {
        const config = JSON.parse(data);
        pool = new Pool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port
        });
        folderImagenPDIAbs = config.folderImagenPDIAbs;
    }
});
//PROCEDIMIENTOS - FUNCIONES

function nameFromPath(str) {
    return str.split('\\').pop().split('/').pop();
  }

const getPDI = (_req, res) => {
    let json;
    let index = 0;
    console.log('getPDI');
    pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=true')
        .then((respuesta) => {
            json = respuesta.rows;
            pool.query('SELECT id,nombre FROM categorias').then((resp) => {
                for (let index = 0; index < respuesta.rows.length; index++) {
                    for (let index2 = 0; index2 < resp.rows.length; index2++) {
                        if (resp.rows[index2].id == respuesta.rows[index].categoria) {
                            json[index].nombreCategoria = resp.rows[index2].nombre;
                        }
                    }
                }
                res.status(200).json(json);
            })

        })
};

const obtenerPDIPendientes = (req, res) => {
    let json;
    let index = 0;
    console.log('obtenerPDIPendientes');
    pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=false')
        .then((respuesta) => {
            json = respuesta.rows;
            pool.query('SELECT id,nombre FROM categorias').then((resp) => {
                for (let index = 0; index < respuesta.rows.length; index++) {
                    for (let index2 = 0; index2 < resp.rows.length; index2++) {
                        if (resp.rows[index2].id == respuesta.rows[index].categoria) {
                            json[index].nombreCategoria = resp.rows[index2].nombre;
                        }
                    }
                }
                res.status(200).json(json);
            })
        })
}

const createPDI = (req, res) => {
    console.log('createPDI');
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, imagenes } = req.body;
    pool.query('SELECT * FROM horarios ORDER BY id desc limit 1', (err, cb) => {
        const idhorario = cb.rows[0].id;
        pool.query('INSERT INTO puntodeinteres (nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, baja, imagenes, lat, long, idhorario) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, baja, imagenes, lat, long, idhorario])
            .then(respuesta => console.log(respuesta))
            .then(res.status(201).json({ message: 'PDI agregado con exito' }));
    })
}

const getPDIByID = (req, res) => {
    console.log('getPDIbyID');
    const id = req.params.id;
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE id = $1 AND aprobado=true and baja=false', [id])
        .then(respuesta => res.satus(200).json(respuesta.rows));
};


const deletePDI = (req, res) => {
    console.log('deletePDI');
    const id = req.params.id;
    pool.query('SELECT imagenes FROM puntodeinteres WHERE id =$1', [id])
        .then((query) => {
            for (let index = 0; index < query.rows[0].imagenes.length; index++) {
                pool.query('SELECT * FROM imagenes WHERE id = $1', [query.rows[0].imagenes[index]])
                    .then((queryPath) => {
                        console.log('querypath'+ queryPath.rows[0].ruta);
                        console.log(nameFromPath(queryPath.rows[0].ruta));
                        pathImagen = folderImagenPDIAbs + nameFromPath(queryPath.rows[0].ruta);
                        console.log('path imagen'+ pathImagen);
                        fs.unlink(pathImagen);
                    })
            }
        })

    pool.query('SELECT * FROM puntodeinteres WHERE id =$1', [id])
        .then((respuesta) => {
            pool.query('UPDATE horarios SET baja=true WHERE id=$1', [respuesta.rows[0].idhorario])
            for (let index = 0; index < respuesta.rows[0].imagenes.length; index++) {
                pool.query('DELETE FROM imagenes WHERE id=$1', [respuesta.rows[0].imagenes[index]]);
            };
        });
    pool.query('UPDATE puntodeinteres SET baja=true WHERE id=$1', [id])
        .then(respuesta => console.log(respuesta))
        .then(res.status(200).send());

};

const updatePDI = (req, res) => {
    console.log('UpdatePDI');
    const id = req.params.id;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, imagenes } = req.body;
    pool.query('UPDATE puntodeinteres SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5, provincia=$6, localidad=$7, telefono=$8, precio=$9, email=$10, aprobado=$11, lat=$12, long=$13, imagenes=$15 WHERE id =$14', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, id, imagenes])
        .then(respuesta => console.log(respuesta))
        .then(res.status(200).send());
};

module.exports = {
    getPDI,
    createPDI,
    deletePDI,
    updatePDI,
    obtenerPDIPendientes,
    getPDIByID
}