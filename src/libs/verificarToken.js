const express = require('express');
const jwt = require('jsonwebtoken');


function tokenValidation(req, res, next) {
    const token = req.header('auth-token');
    if (!token) { return res.status(500).json('Acceso denegado') }
    else {
        try {
            const payload = jwt.verify(token, process.env.SECRET_KEY || 'tokentest');
            req.token = token;
            return next();
        }
        catch (err) {
            return res.status(500).json('Error en el token.');
        }

    }
}


module.exports = { tokenValidation };