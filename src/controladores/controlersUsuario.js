const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

const signup = (req, res) => {
    console.log('signUp');
    baja = false;
    let salt;
    username = req.body.username;
    pool.query('SELECT * from usuarios WHERE username= $1', [username], (err, result) => {
        if (result.rows[0] == null) {
            const { username, password, email, privilegios, nombre, apellido } = req.body;
            salt = bcrypt.genSalt(3, function (err, data) {
                salt = data;
                bcrypt.hash(password, salt, function (err, passHash) {
                    if (passHash) {
                        passwordEncriptada = passHash;
                        const respuesta = pool.query('INSERT INTO usuarios (username, email ,password , baja, privilegios, nombre, apellido) VALUES ($1, $2, $3, $4, $5, $6,$7)', [username, email, passwordEncriptada, baja, privilegios, nombre, apellido])
                            .then(respuesta => console.log(respuesta))
                            .then(token3 = jwt.sign(Date.now(), process.env.SECRET_KEY || 'tokentest'/*, {expiresIn: 60*60}*/))
                            .then(res.header('auth-token', token3).status(201).json({
                                message: 'Usuario agregado con exito'
                            })
                            )
                    }
                })
            })
        }
        else { res.status(409).json('Usuario existente') }
    })

};

const signin = (req, res) => {
    console.log('signIn');
    username = req.body.username;
    pool.query('SELECT * from usuarios WHERE username= $1', [username], (err, result) => {
        if (result.rows[0] == null) {
            res.status(401).json('Username incorrecto')
        }
        else {
            bcrypt.compare(req.body.password, result.rows[0].password, function (err, data) {
                if (data) {
                    const payload = { check: true }
                    token2 = jwt.sign(Date.now(), process.env.SECRET_KEY || 'tokentest');
                    res.header('auth-token', token2);
                    res.status(200).header('Access-Control-Expose-Headers', 'auth-token').json(result.rows[0]);
                }
                else { res.status(401).json('Contraseña incorrecta') };
            })
        }
    })

};

const getUsuarios = (req, res) => {
    console.log('getUsuarios');
    pool.query('SELECT * FROM usuarios WHERE baja=false')
        .then(respuesta => {
            res.status(200).json(respuesta.rows);
        });
}



const deleteUsuario = (req, res) => {
    console.log('deleteUsuario');
    const id = req.params.id;
    pool.query('UPDATE usuarios SET baja=true WHERE id=$1', [id])
        .then(respu => console.log(respu))
        .then(res.status(204).send());
}

const updateUsuario = (req, res) => {
    console.log('updateUsuario');
    const id = req.params.id;
    const hashear = req.header('hashear');
    const { username, email, password, privilegios, nombre, apellido } = req.body;
    if (hashear == 'true') {
        salt = bcrypt.genSalt(3, function (err, data) {
            salt = data;
            bcrypt.hash(password, salt, function (err) {
                if (data) {
                    passwordEncriptada = data;
                    pool.query('UPDATE usuarios SET username=$1, email=$2, password=$3, privilegios=$4, nombre=$6, apellido=$7 WHERE id=$5', [username, email, passwordEncriptada, privilegios, id, nombre, apellido])
                        .then(respuesta => console.log(respuesta))
                        .then(res.status(204).send());

                }
            })
        })
    }
    else {
        pool.query('UPDATE usuarios SET username=$1, email=$2, password=$3, privilegios=$4, nombre=$6, apellido=$7 WHERE id=$5', [username, email, password, privilegios, id, nombre, apellido])
            .then(respuesta => console.log(respuesta))
            .then(res.status(204).send());
    }
}



module.exports = {
    signup,
    signin,
    getUsuarios,
    updateUsuario,
    deleteUsuario
}