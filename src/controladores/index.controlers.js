const {Pool} = require('pg');
const jwt = require('jsonwebtoken');
const { request } = require('express');
const bcrypt = require('bcryptjs');
const { size, result } = require('underscore');

const pool= new Pool({
    host:'localhost',
    user:'postgres',
    password: 'nadia1998',
    database: 'puntosdeinteres',
    port: '5432'
});


const getPDI = (_req,res) => {
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE baja=false')
    .then(respuesta => res.status(200).json(respuesta.rows));
};

const obtenerPorNombre = (req, res) => {
    const nombrebuscar= req.params.name;
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE baja = false AND nombre LIKE $1', [nombrebuscar])
    .then(respuesta => res.status(200).json(respuesta.rows));
}

const obtenerPorCategoria = (req, res) => {
    const categoriabuscar= req.params.category;
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE baja = false AND categoria LIKE $1', [categoriabuscar])
    .then(respuesta => res.status(200).json(respuesta.rows));
}

const createPDI = (req,res) => {
    baja = false;
    const {nombre, descripcion, categoria, direccion, telefono, horaApertura, horaCierre, precio} = req.body;
    const respuesta = pool.query('INSERT INTO puntodeinteres (nombre, descripcion, categoria, direccion, telefono, horaApertura, horaCierre, precio, baja) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9)', [ nombre, descripcion, categoria, direccion, telefono, horaApertura, horaCierre, precio, baja])
    .then(respuesta => console.log(respuesta))
    .then(res.json({
        message: 'Punto de interes agregado con exito',
        body: {
                puntodeinteres: {nombre, descripcion, categoria, direccion, telefono, horaApertura, horaCierre, precio }
              }
    }))
};

const deletePDI = (req,res) => {
    const id= req.params.id
    baja = true;
    const respuesta = pool.query('UPDATE puntodeinteres SET baja=$1 WHERE id=$2', [baja, id])
    .then(respuesta => console.log(respuesta))
    .then(res.json(`Punto de interes ${id} eliminado con exito `));
};

const getPDIByID = (req,res) => {
    const id =req.params.id;
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE id = $1', [id])
   .then(respuesta => res.json(respuesta.rows));
};

const updatePDI = (req,res) => {
    const id = req.params.id;
    const {nombre, descripcion, categoria, direccion, telefono, horaapertura, horacierre, precio } = req.body;
    const respuesta = pool.query('UPDATE puntodeinteres SET nombre=$1, descripcion=$2, categoria=$3, direccion=$4, telefono=$5, horaapertura=$6, horacierre=$7, precio=$8  WHERE id=$9', [ nombre,  descripcion,categoria, direccion, telefono, horaapertura, horacierre, precio, id])
    .then(respuesta => console.log(respuesta))
    .then(res.json(`Punto de interes ${id} actualizado con exito `));
};

const getEvento = (_req,res) => {
    const respuesta = pool.query('SELECT * FROM eventos WHERE baja=false')
    .then(respuesta => res.status(200).json(respuesta.rows));
};

const getEventosPorCategoria= (req, res) => {
    const categoriabuscar= req.params.category;
    const respuesta = pool.query('SELECT * FROM eventos WHERE baja = false AND categoria LIKE $1', [categoriabuscar])
    .then(respuesta => res.status(200).json(respuesta.rows));
}

const getEventosPorNombre = (req, res) => {
    const nombrebuscar= req.params.name;
    const respuesta = pool.query('SELECT * FROM eventos WHERE baja = false AND nombre LIKE $1', [nombrebuscar])
    .then(respuesta => res.status(200).json(respuesta.rows));
}

const createEvento = (req,res) => {
    baja = false;
    const {nombre, descripcion, categoria, direccion, fechaInicio, fechaFin, horaApertura, horaCierre, precio} = req.body;
    const respuesta = pool.query('INSERT INTO eventos (nombre, descripcion, categoria, direccion, fechaInicio, fechaFin, horaApertura, horaCierre, precio, baja) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10)', [ nombre, descripcion, categoria, direccion, fechaInicio, fechaFin, horaApertura, horaCierre, precio, baja])
    .then(respuesta => console.log(respuesta))
    .then(res.json({
        message: 'Evento agregado con exito',
        body: {
                evento: {nombre, descripcion, categoria, direccion, fechaInicio, fechaFin, horaApertura, horaCierre, precio}
              }
    }))
};

const deleteEvento = (req,res) => {
    const id= req.params.id
    baja = true;
    const respuesta = pool.query('UPDATE eventos SET baja=$1 WHERE id=$2', [baja, id])
    .then(respuesta => console.log(respuesta))
    .then(res.json(`Evento ${id} eliminado con exito `));
};

const updateEvento = (req,res) => {
    const id = req.params.id;
    const {nombre, descripcion, categoria, direccion, fechainicio, fechafin, horaapertura, horacierre, precio} = req.body;
    const respuesta = pool.query('UPDATE eventos SET nombre=$1, descripcion=$2, categoria=$3, direccion=$4, fechainicio=$5, fechafin=$6, horaapertura=$7, horacierre=$8, precio=$9  WHERE id=$10', [nombre, descripcion, categoria, direccion, fechainicio, fechafin, horaapertura, horacierre, precio, id])
    .then(respuesta => console.log(respuesta))
    .then(res.json(`Evento ${id} actualizado con exito `));
};

const signup = (req,res ) => {
//signup
    baja= false;
    pool.query("SELECT id from usuarios where baja=false order by id desc",(err, result) => 
        {  tam = result.rowCount; 
        const {username,password, email} = req.body;
        salt = bcrypt.genSalt(10);
        bcrypt.hash(password,salt, function(err,data) {
            if (data) {
                passwordEncriptada= data;
                const respuesta = pool.query('INSERT INTO usuarios (username, email ,password , baja) VALUES ( $1, $2,$3, $4)', [ username, email,passwordEncriptada,  baja])
                .then(respuesta => console.log(respuesta))
                .then(token = jwt.sign(tam, process.env.SECRET_KEY || 'tokentest'))
                .then(res.header('auth-token', token).json({
                message: 'Usuario agregado con exito',
                body: {
                        usuario: {username, email}
                        }})
                     )
            }
        }
        )

      
     } );
 };

const signin = (req,res ) => {
    
};

const profile = (req,res ) => {
    
};


const validarpass = (passNew, passwordVieja) => {
   bcrypt.compare(passNew,passwordVieja);  //boolean true or false
};


/* const login = (req,res ) => {
    const user = req.bady; //aca va a el usuario completo
    const token = jwt.sign({user.id}, 'my_secret_key'); //en el segundo parametro va la variable de entorno, esta linea genera el token para el usuario
    res.header('auth-token', token).json({user});
};

const rutasegura = (req,res) => {
    jwt.verify(req.token, 'my_secret_key', (err,data)=> {
        if (err) {
            res.sendStatus(403);
        } else{
            res.json({
                text: 'protected', 
                data
            })
        }
    })
};

function ensureToken (req,res, next){
    const bearedHeader = req.headers['authorization'];
    console.log(bearedHeader);
    if (typeof bearedHeader !== 'undefined') {
        const beared = bearedHeader.split(" ");
        const bearedToken = beared[1];
        req.token = bearedToken;
        console.log(bearedToken);
        next();
    } else 
    {
        res.sendStatus(403);
    }
}; */

module.exports = {getPDI, obtenerPorNombre, obtenerPorCategoria, createPDI, getPDIByID, deletePDI, updatePDI, getEvento, getEventosPorNombre, getEventosPorCategoria, createEvento, deleteEvento, updateEvento, signin, signup, profile}

