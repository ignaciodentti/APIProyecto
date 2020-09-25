const { Pool } = require('pg');
const { } = require('morgan');
var fs = require('fs');
const { json } = require('express');
const express = require('express');
const app = express();

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

const createHorarios = (req, res) => {
    console.log('createHorario');
    baja = false;
    const { lunesAp, lunesCie, martesAp, martesCie, miercolesAp, miercolesCie, juevesAp, juevesCie, viernesAp, viernesCie, sabadoAp, sabadoCie, domingoAp, domingoCie } = req.body;
    pool.query('INSERT INTO horarios (lunesAp , lunesCie , martesAp ,martesCie ,miercolesAp ,miercolesCie ,juevesAp ,juevesCie ,viernesAp ,viernesCie ,sabadoAp ,sabadoCie ,domingoAp ,domingoCie, baja) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)', [lunesAp, lunesCie, martesAp, martesCie, miercolesAp, miercolesCie, juevesAp, juevesCie, viernesAp, viernesCie, sabadoAp, sabadoCie, domingoAp, domingoCie, baja])
        .then(respuesta => console.log(respuesta))
        .then(res.status(201).json('Horario agregado con exito'));
}

const getHorarioByID = (req, res) => {
    console.log('getHorarioById');
    const id = req.params.id;
    pool.query('SELECT * FROM horarios WHERE id = $1 and baja= false', [id])
        .then(respuesta => res.status(200).json(respuesta.rows));
};

const updateHorario = (req, res) => {
    console.log('updateHorario');
    const id = req.params.id;
    const { lunesAp, lunesCie, martesAp, martesCie, miercolesAp, miercolesCie, juevesAp, juevesCie, viernesAp, viernesCie, sabadoAp, sabadoCie, domingoAp, domingoCie } = req.body;
    pool.query('UPDATE horarios SET lunesap=$1, lunescie=$2, martesap=$3, martescie=$4, miercolesap=$5 , miercolescie= $6, juevesap=$7, juevescie=$8, viernesap=$9, viernescie=$10, sabadoap=$11, sabadocie=$12, domingoap=$13, domingocie=$14  WHERE id=$15', [lunesAp, lunesCie, martesAp, martesCie, miercolesAp, miercolesCie, juevesAp, juevesCie, viernesAp, viernesCie, sabadoAp, sabadoCie, domingoAp, domingoCie, id])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204).send());
};

module.exports = {
    createHorarios,
    getHorarioByID,
    updateHorario
}