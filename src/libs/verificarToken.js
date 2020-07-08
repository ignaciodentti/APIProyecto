const express = require('express');
const jwt = require('jsonwebtoken');


function tokenValidation(req,res,next) {
    const token= req.header('auth-token');
    if (!token) 
    {return res.status(400).json('Acceso denegado')}
    else 
    {
        const payload = jwt.verify(token, process.env.SECRET_KEY || 'tokentest');
        console.log(payload);
    }

} 
    

module.exports = { tokenValidation };