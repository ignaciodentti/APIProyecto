const { Pool } = require('pg');
const { } = require('morgan');
var fs = require('fs');
const { json } = require('express');

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

const getCategoria = (req, res) => {
    console.log('getCategoria');
    pool.query('SELECT * FROM categorias WHERE baja = false AND padre IS NULL')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createCategoria = (req, res) => {
    console.log('createCategoria');
    baja = false;
    const { nombre, padre } = req.body;

    if (padre != null) {
        pool.query('SELECT * FROM categorias WHERE nombre = $1', [padre], (err, respPadre) => {
            if (respPadre.rows[0].padre == null) {
                let IDPadre = respPadre.rows[0].id;
                pool.query('INSERT INTO categorias (nombre, padre, baja) VALUES ($1, $2, $3)', [nombre, IDPadre, false])
                    .then(respuesta => console.log(respuesta))
                    .then(res.status(201).json({
                        message: 'Categoria agregada con exito'
                    }))
            }
            else {
                res.status(400).json('No se pueden agregar subcategorías a una subcategoría.');
            }

        })

    }

    else {
        pool.query('INSERT INTO categorias (nombre, padre, baja) VALUES ($1, $2, $3)', [nombre, null, false])
            .then(respuesta => console.log(respuesta))
            .then(res.status(201).json({
                message: 'Categoria agregada con exito'
            }))

    }
};

const deleteCategoria = (req, res) => {
    console.log('deleteCategoria');
    const id = req.params.id
    pool.query('(SELECT e.id, e.nombre,e.categoria,e.baja FROM eventos e WHERE e.categoria=$1 AND e.baja=false) UNION ALL (SELECT p.id, p.nombre, p.categoria, p.baja FROM puntodeinteres p WHERE p.categoria= $1 AND p.baja=false);', [id], (err, result) => {
        if (result.rows.length == 0) { //no tiene pdi asociados dicha categoria
            pool.query('SELECT * FROM categorias WHERE padre = $1 AND baja = false', [id], (err, resultadoQuery) => {
                if (resultadoQuery.rows.length == 0) {
                    pool.query('UPDATE categorias SET baja=true WHERE id=$1', [id])
                        .then(res.status(204))
                }
                else {
                    res.status(400).json('Error - La categoría no se puede eliminar ya que tiene subcategorías activas.');
                }
            })
        }
        else {
            res.status(400).json('Error - La categoría no se puede eliminar ya que tiene puntos de interes o eventos asociados.');
        }
    })
}

const getSubcategoria = (req, res) => {
    console.log('getSubCategoria');
    pool.query('SELECT * FROM categorias WHERE baja = false AND NOT padre IS NULL')
        .then(respuesta => {
            res.status(200).json(respuesta.rows);
        });
}

const padreSubCategoria = (req, res) => {
    console.log('padreSubCategoria');
    const id = req.params.id;
    pool.query('SELECT nombre FROM categorias WHERE id= $1', [id])
        .then(respuesta => {
            res.status(200).json(respuesta.rows[0].nombre);
        });
}

const updateCategoria = (req, res) => {
    console.log('updateCategoria');
    const id = req.params.id;
    const { nombre, padre } = req.body;
    pool.query('UPDATE categorias SET nombre=$1, padre=$2 WHERE id=$3', [nombre, padre, id])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204));
};

const getCategoriaByNombre = (req, res) => {
    console.log('getCategoriaByNombre');
    const nombre = req.params.nombre;
    const respuesta = pool.query('SELECT id FROM categorias WHERE nombre = $1 and baja=false', [nombre])
        .then(respuesta => res.json(respuesta.rows[0]));
};

const getCategoriaById = (req, res) => {
    console.log('getCategoriaById');
    const id = req.params.id;
    const respuesta = pool.query('SELECT nombre FROM categorias WHERE id= $1 and baja=false', [id])
        .then(respuesta => res.json(respuesta.rows[0]));
};


module.exports = {
    getCategoria,
    createCategoria,
    deleteCategoria,
    getSubcategoria,
    padreSubCategoria,
    updateCategoria,
    getCategoriaByNombre,
    getCategoriaById    
}