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
    const { lunes, martes, miercoles, jueves, viernes, sabado, domingo } = req.body;
    pool.query('INSERT INTO horarios (lunes, martes, miercoles, jueves, viernes, sabado, domingo, baja) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8 )', [lunes, martes, miercoles, jueves, viernes, sabado, domingo, false])
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
    const { lunes, martes, miercoles, jueves, viernes, sabado, domingo } = req.body;
    pool.query('UPDATE horarios SET lunes=$1, martes=$2, miercoles=$3, jueves=$4, viernes=$5, sabado=$6, domingo=$7 WHERE id=$8', [lunes, martes, miercoles, jueves, viernes, sabado, domingo, id])
        .then(respuesta => console.log(respuesta))
        .then(res.status(200).send());
};

module.exports = {
    createHorarios,
    getHorarioByID,
    updateHorario
}