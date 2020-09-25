const { Pool } = require('pg');
const { } = require('morgan');
var fs = require('fs');


//esta es la ruta de la carpeta en donde se guardan las imágenes (ruta relativa desde ésta carpeta).
const folderImagenPDIAbs = 'C:/Users/Nacho/Documents/GitHub/APIProyecto/src/imagenes/PDI/' //REEMPLAZAR CON RUTA DEL SERVIDOR

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
  }
}); 

//PROCEDIMIENTOS - FUNCIONES

const getPDI = (_req, res) => {
    console.log('getPDI');
    pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=true')
        .then(respuesta => {
            res.status(200).json(respuesta.rows);
        });
};

const obtenerPDIPendientes = (req, res) => {
    console.log('obtenerPDIPendientes');
    pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createPDI = (req, res) => {
    console.log('createPDI');
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, imagenes } = req.body;
    pool.query('SELECT * FROM horarios ORDER BY id desc limit 1', (err,cb)=> {
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
        .then(respuesta => res.json(respuesta.rows));
};


const deletePDI = (req, res) => {
    console.log('deletePDI');
    const id = req.params.id;
    pool.query('SELECT imagenes FROM puntodeinteres WHERE id =$1', [id])
        .then((query) => {
            for (let index = 0; index < query.rows[0].imagenes.length; index++) {
                const queryPath = pool.query('SELECT * FROM imagenes WHERE id = $1', [query.rows[0].imagenes[index]])
                    .then((queryPath) => {
                        pathImagen = folderImagenPDIAbs + nameFromPath(queryPath.rows[0].ruta);
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
        .then(res.status(204).send());

};

const updatePDI = (req, res) => {
    console.log('UpdatePDI');
    const id = req.params.id;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, imagenes } = req.body;
    pool.query('UPDATE puntodeinteres SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5, provincia=$6, localidad=$7, telefono=$8, precio=$9, email=$10, aprobado=$11, lat=$12, long=$13, imagenes=$15 WHERE id =$14', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, id, imagenes])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204).send());
};

module.exports = {
    getPDI,
    createPDI,
    deletePDI,
    updatePDI,
    obtenerPDIPendientes,
    getPDIByID }