const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const multer = require("multer");
const path = require ('path');
const { token } = require('morgan');
//const { size, result } = require('underscore');

//ésta es la ruta de la carpeta en donde se guardan las imágenes (ruta relativa desde ésta carpeta).
const folderImagen = './src/imagenes'

 

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgre',
    database: 'viviconcepcion',
    port: '5432'
});

const getPDI = (_req, res) => {
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=true')
        .then(respuesta => res.status(200).json(respuesta.rows));
};

const obtenerPDIPorCategoria = (req, res) => {
    const categoriabuscar = req.params.category;
    const respuesta = pool.query('SELECT puntodeinteres.nombre, puntodeinteres.descripcion, puntodeinteres.categoria, puntodeinteres.calle, puntodeinteres.numero, puntodeinteres.provincia, puntodeinteres.localidad, puntodeinteres.telefono, puntodeinteres.horaApertura, puntodeinteres.horaCierre, puntodeinteres.precio, puntodeinteres.email, puntodeinteres.diasAbierto, puntodeinteres.baja FROM categorias INNER JOIN puntodeinteres ON puntodeinteres.categoria = categorias.nombre WHERE puntodeinteres.baja = false AND puntodeinteres.aprobado=true AND categorias.padre LIKE $1 UNION SELECT puntodeinteres.nombre, puntodeinteres.descripcion, puntodeinteres.categoria, puntodeinteres.calle, puntodeinteres.numero, puntodeinteres.provincia, puntodeinteres.localidad, puntodeinteres.telefono, puntodeinteres.horaApertura, puntodeinteres.horaCierre, puntodeinteres.precio, puntodeinteres.email, puntodeinteres.diasAbierto, puntodeinteres.baja FROM categorias INNER JOIN puntodeinteres ON puntodeinteres.categoria = categorias.nombre WHERE puntodeinteres.baja = false AND puntodeinteres.aprobado=true AND puntodeinteres.categoria LIKE $1 AND categorias.nombre LIKE $1', [categoriabuscar])
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const obtenerPDIPendientes = (req, res) => {
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createPDI = (req, res) => {
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, horaapertura, horacierre, precio, email, aprobado, diasAbierto, lat, long} = req.body;
    const respuesta = pool.query('INSERT INTO puntodeinteres (nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, horaapertura, horacierre, precio, email, aprobado, baja, diasAbierto, lat, long) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, horaapertura, horacierre, precio, email, aprobado, baja, diasAbierto, lat, long])
        .then(respuesta => console.log(respuesta))
        .then(res.json({
            message: 'Punto de interes agregado con exito',
            body: {
                puntodeinteres: { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, horaapertura, horacierre, precio, email, aprobado }
            }
        }))
};

const deletePDI = (req, res) => {
    const id = req.params.id
    baja = true;
    const respuesta = pool.query('UPDATE puntodeinteres SET baja=$1 WHERE id=$2', [baja, id])
        .then(respuesta => console.log(respuesta))
        .then(res.json(`Punto de interes ${id} eliminado con exito `));
};

const getPDIByID = (req, res) => {
    const id = req.params.id;
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE id = $1 AND aprobado=true', [id])
        .then(respuesta => res.json(respuesta.rows));
};

const updatePDI = (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, horaapertura, horacierre, precio, email, aprobado, diasAbierto, lat, long } = req.body;
    const respuesta = pool.query('UPDATE puntodeinteres SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, telefono=$5, horaapertura=$6, horacierre=$7, precio=$8, provincia=$9, localidad=$10, email=$11, numero=$12, aprobado=$14, diasAbierto = $15, lat=$16, long=$17 WHERE id=$13', [nombre, descripcion, categoria, calle, telefono, horaapertura, horacierre, precio, provincia, localidad, email, numero, id, aprobado, diasAbierto,lat, long])
        .then(respuesta => console.log(respuesta))
        .then(res.json(`Punto de interes ${id} actualizado con exito `));
};

const getEvento = (_req, res) => {
    const respuesta = pool.query('SELECT * FROM eventos WHERE baja=false AND aprobado=true')
        .then(respuesta => res.status(200).json(respuesta.rows));
};

const obtenerEventosPorCategoria = (req, res) => {
    const categoriabuscar = req.params.category;
    const respuesta = pool.query('SELECT  eventos.nombre, eventos.descripcion, eventos.categoria, eventos.calle, eventos.numero, eventos.fechaInicio, eventos.fechaFin, eventos.horaApertura, eventos.horaCierre, eventos.provincia, eventos.localidad, eventos.email, eventos.precio, eventos.baja FROM categorias INNER JOIN eventos ON eventos.categoria = categorias.nombre WHERE eventos.baja = false AND eventos.aprobado=true AND categorias.padre LIKE $1 UNION SELECT eventos.nombre, eventos.descripcion, eventos.categoria, eventos.calle, eventos.numero, eventos.fechaInicio, eventos.fechaFin, eventos.horaApertura, eventos.horaCierre, eventos.provincia, eventos.localidad, eventos.email, eventos.precio, eventos.baja FROM categorias INNER JOIN eventos ON eventos.categoria = categorias.nombre WHERE eventos.baja = false AND eventos.aprobado=true AND eventos.categoria LIKE $1 AND categorias.nombre LIKE $1', [categoriabuscar])
        .then(respuesta => res.status(200).json(respuesta.rows));
}


const obtenerEventosPendientes = (req, res) => {
    const respuesta = pool.query('SELECT * FROM eventos WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createEvento = (req, res) => {
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado,lat, long } = req.body;
    const respuesta = pool.query('INSERT INTO eventos (nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, baja) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)', [nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado,lat, long, baja])
        .then(respuesta => console.log(respuesta))
        .then(res.json({
            message: 'Evento agregado con exito',
            body: {
                evento: { nombre, descripcion, categoria, fechainicio, fechafin, horaapertura, horacierre, precio }
            }
        }))
};

const deleteEvento = (req, res) => {
    const id = req.params.id
    baja = true;
    const respuesta = pool.query('UPDATE eventos SET baja=$1 WHERE id=$2', [baja, id])
        .then(respuesta => console.log(respuesta))
        .then(res.json(`Evento ${id} eliminado con exito `));
};

const updateEvento = (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, aprobado, lat, long } = req.body;
    const respuesta = pool.query('UPDATE eventos SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5 , provincia= $6, localidad=$7, fechainicio=$8, fechafin=$9, horaapertura=$10, horacierre=$11, email=$12, precio=$13, aprobado=$15, lat=$16, long=$17  WHERE id=$14', [nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, id, aprobado,lat, long])
        .then(respuesta => console.log(respuesta))
        .then(res.json(`Evento ${id} actualizado con exito `));
};

const signup = (req, res) => {
    baja = false;
    let salt;
    username = req.body.username;
    pool.query('SELECT * from usuarios WHERE username= $1', [username], (err, result) => {
        if (result.rows[0] == null) {
                const { username, password, email, privilegios } = req.body;
                salt = bcrypt.genSalt(3, function (err, data) {
                    salt = data;
                    bcrypt.hash(password, salt, function (err, data) {
                        if (data) {
                            passwordEncriptada = data;
                            const respuesta = pool.query('INSERT INTO usuarios (username, email ,password , baja, privilegios) VALUES ($1, $2, $3, $4, $5)', [username, email, passwordEncriptada, baja, privilegios])
                                .then(respuesta => console.log(respuesta))
                                .then(token = jwt.sign(crypto.randomBytes(8).toString("hex"), process.env.SECRET_KEY || 'tokentest'/*, {expiresIn: 60*60}*/))
                                .then(res.header('auth-token', token).json({
                                    message: 'Usuario agregado con exito',
                                    body: {
                                        usuario: { username, email, passwordEncriptada, salt }
                                    }
                                })
                                )
                        }
                    })
                })
        }
        else {res.status(500).json('Usuario existente')}
    })
    
};


const signin = (req, res) => {
    username = req.body.username;
    pool.query('SELECT * from usuarios WHERE username= $1', [username], (err, result) => {
        if (result.rows[0] == null) {
            res.status(400).json('Username incorrecto')
        }
        else {
            bcrypt.compare(req.body.password, result.rows[0].password, function (err, data) {
                if (data) {
                   
                    const payload = {check: true}
                    token2 = jwt.sign(crypto.randomBytes(8).toString("hex"), process.env.SECRET_KEY || 'tokentest');
                    console.log('Usuario logueado: ' + req.body.username + ' con el token: ' + token2);
                    res.header('auth-token', token2);
                    res.status(200).header('Access-Control-Expose-Headers', 'auth-token').json(result.rows[0].privilegios);
                }
                else { res.status(400).json('Contraseña incorrecta') };
            })
        }
    })

};


const getCategoria = (req, res) => {
    const respuesta = pool.query('SELECT * FROM categorias WHERE baja = false AND padre IS NULL')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createCategoria = (req, res) => {
    baja = false;
    const { nombre, padre } = req.body;
    const respuesta = pool.query('INSERT INTO categorias (nombre, padre, baja) VALUES ($1, $2, $3)', [nombre, padre, baja])
        .then(respuesta => console.log(respuesta))
        .then(res.json({
            message: 'categoria agregada con exito',
            body: {
                categoria: { nombre, padre }
            }
        }))
};

const deleteCategoria = (req, res) => {
    const id = req.params.id
    baja = true;
    const respuesta = pool.query('UPDATE categorias SET baja=$1 WHERE id=$2', [baja, id])
        .then(respuesta => console.log(respuesta))
        .then(res.json(`Categoria ${id} eliminada con exito `));
}

const getSubcategoria = (req, res) => {
    const respuesta = pool.query('SELECT * FROM categorias WHERE baja = false AND NOT padre IS NULL')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

 const getImagenes = (req,res) => {
    return res.send('Este es el home');
}

const postImagenes = (req,res) => {
    console.log('PostImagenes');
    return res.send(req.file);
} 

//asigna a la imagen que guarda el nombre original
const storage = multer.diskStorage({
    destination: (req, file, cb) => {cb(null, folderImagen)}, 
    filename: (req, file, cb) => {
        const nombre = req.header('nombre');
        console.log('EL NOMBRE DE IMAGEN ES: '+nombre);
        cb(null, /*crypto.randomBytes(16).toString("hex")*/nombre+ path.extname(file.originalname).toLocaleLowerCase());
        console.log('storage');
    }
});

const upload= multer({
    storage: storage,
    dest: './imagenes',
    fileFilter: (req,file, cb) => {
        console.log('upload');
        const filetypes = /jpeg|jpg|png|gif/;
        const minetype = filetypes.test((file.mimetype).toLowerCase());
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (minetype && extname) { return cb(null,true);}
        cb("Error: Archivo debe ser una imagen valida"); 
    }
 }) 

module.exports = {
    getPDI,
    obtenerPDIPorCategoria,
    createPDI,
    getPDIByID,
    deletePDI,
    updatePDI,
    getEvento,
    obtenerEventosPorCategoria,
    createEvento,
    deleteEvento,
    updateEvento,
    signin,
    signup,
    getCategoria,
    createCategoria,
    deleteCategoria,
    getSubcategoria,
    obtenerEventosPendientes,
    obtenerPDIPendientes, 
    getImagenes, 
    postImagenes, 
    upload
}
