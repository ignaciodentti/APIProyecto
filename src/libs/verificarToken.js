const express = require('express');
const jwt = require('jsonwebtoken');


function tokenValidation(req, res, next) {
    console.log('COMIENZO TOKEN VALIDATIOn');
    const token = req.header('auth-token');
    if (!token) { return res.status(500).json('Acceso denegado') }
    else {
        try {
            const payload = jwt.verify(token, process.env.SECRET_KEY || 'tokentest');
            console.log('token verificado: ' + token);
            req.token = token;
            return next();
        }
        catch (err) {
            return res.status(500).json('Error en el token.');
        }

    }
}


module.exports = { tokenValidation };