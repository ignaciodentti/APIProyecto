const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
//const { } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const multer = require("multer");
const path = require('path');
const { } = require('morgan');
const express = require('express');
const app = express();
//const { size, result } = require('underscore');

//ésta es la ruta de la carpeta en donde se guardan las imágenes (ruta relativa desde ésta carpeta).
const folderImagen = './src/imagenes/'
const folderImagenPDI = './src/imagenes/PDI/'
const folderImagenEvento = './src/imagenes/evento/'



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
    const respuesta = pool.query('SELECT puntodeinteres.nombre, puntodeinteres.descripcion, puntodeinteres.categoria, puntodeinteres.calle, puntodeinteres.numero, puntodeinteres.provincia, puntodeinteres.localidad, puntodeinteres.telefono, puntodeinteres.precio, puntodeinteres.email, puntodeinteres.diasAbierto, puntodeinteres.baja FROM categorias INNER JOIN puntodeinteres ON puntodeinteres.categoria = categorias.nombre WHERE puntodeinteres.baja = false AND puntodeinteres.aprobado=true AND categorias.padre LIKE $1 UNION SELECT puntodeinteres.nombre, puntodeinteres.descripcion, puntodeinteres.categoria, puntodeinteres.calle, puntodeinteres.numero, puntodeinteres.provincia, puntodeinteres.localidad, puntodeinteres.telefono, puntodeinteres.precio, puntodeinteres.email, puntodeinteres.diasAbierto, puntodeinteres.baja FROM categorias INNER JOIN puntodeinteres ON puntodeinteres.categoria = categorias.nombre WHERE puntodeinteres.baja = false AND puntodeinteres.aprobado=true AND puntodeinteres.categoria LIKE $1 AND categorias.nombre LIKE $1', [categoriabuscar])
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const obtenerPDIPendientes = (req, res) => {
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createPDI = (req, res) => {
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, diasAbierto, lat, long, imagenes } = req.body;

    rutasImg = new Array(imagenes.length);

    const respuesta = pool.query('INSERT INTO puntodeinteres (nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, baja, diasAbierto, imagenes, lat, long) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, baja, diasAbierto, rutasImg, lat, long])
        .then(respuesta => console.log(respuesta))
        .then(
            pool.query('SELECT * FROM puntodeinteres ORDER BY id desc limit 1')
                .then(resp => {
                    app.locals.idPDI = resp.rows[0].id;
                    console.log('app.locals.idPDI: ' + app.locals.idPDI);
                    res.json({
                        message: 'Punto de interes agregado con exito',
                        id: app.locals.idPDI
                    });
                    app.locals.idPDI = '';
                }
                )
        )



}

const createHorarios = (req, res) => {
    console.log('app en horarios:' + app.locals.idPDI);
}

function getFileExtension3(filename) {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

function nameFromPath(str) {
    return str.split('\\').pop().split('/').pop();
}

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
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, diasAbierto, lat, long } = req.body;
    const respuesta = pool.query('UPDATE puntodeinteres SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5, provincia=$6, localidad=$7, telefono=$8, precio=$9, email=$10, aprobado=$11, diasAbierto=$12, lat=$13, long=$14 WHERE id =$15', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, diasAbierto, lat, long, id])
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
    const { nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, imagenes } = req.body;

    rutasImg = new Array(imagenes.length);
    console.log(imagenes.length);
    for (let index = 0; index < imagenes.length; index++) {
        ext = getFileExtension3(imagenes[index]);
        rutasImg[index] = folderImagenEvento + nombre + index + '.' + ext;
    }

    const respuesta = pool.query('INSERT INTO eventos (nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, baja, imagenes) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', [nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, baja, rutasImg])
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
    const respuesta = pool.query('UPDATE eventos SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5 , provincia= $6, localidad=$7, fechainicio=$8, fechafin=$9, horaapertura=$10, horacierre=$11, email=$12, precio=$13, aprobado=$15, lat=$16, long=$17  WHERE id=$14', [nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, id, aprobado, lat, long])
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
                            .then(token3 = jwt.sign(crypto.randomBytes(8).toString("hex"), process.env.SECRET_KEY || 'tokentest'/*, {expiresIn: 60*60}*/))
                            .then(res.header('auth-token', token3).json({
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
        else { res.status(500).json('Usuario existente') }
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

                    const payload = { check: true }
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

const getImagenesPDI = (req, res) => {
    const nombrePDI = req.params.nombre;
    console.log(nombrePDI);
    const respuesta = pool.query('SELECT imagenes FROM puntodeinteres WHERE puntodeinteres.nombre = $1 AND baja = false', [nombrePDI])
        .then((respuesta) => {
            console.log('RESPUESTA: ')
            console.log(respuesta.rows);
            let jsonRes = respuesta.rows[0];

            for (let index = 0; index < jsonRes.imagenes.length; index++) {

                let fileName = nameFromPath(jsonRes.imagenes[index]);               //obtengo el nombre de la imagen
                fileName = 'http://localhost:3000/api/pdi/imagen/' + fileName       //lo concateno al enlace para obtenerlo.

                jsonRes.imagenes[index] = fileName;
            }
            res.json(jsonRes);
        })
}

const getImagenPDI = (req, res) => {
    const fileName = req.params.nombre;
    res.sendFile(fileName, { root: './src/imagenes/PDI' });
}

const getImagenesEvento = (req, res) => {
    const nombreEvento = req.params.nombre;
    console.log(nombreEvento);
    const respuesta = pool.query('SELECT imagenes FROM eventos WHERE eventos.nombre = $1 AND baja = false', [nombreEvento])
        .then((respuesta) => {
            console.log('RESPUESTA: ')
            console.log(respuesta.rows);
            let jsonRes = respuesta.rows[0];

            for (let index = 0; index < jsonRes.imagenes.length; index++) {

                let fileName = nameFromPath(jsonRes.imagenes[index]);                   //obtengo el nombre de la imagen
                fileName = 'http://localhost:3000/api/evento/imagen/' + fileName        //lo concateno al enlace para obtenerlo.

                jsonRes.imagenes[index] = fileName;

            }
            res.json(jsonRes);
        })
}

const getImagenEvento = (req, res) => {
    const fileName = req.params.nombre;
    res.sendFile(fileName, { root: './src/imagenes/evento' });
}

const postImagenes = (req, res) => {
    return res.send(req.file);
}

const storagePDI = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, folderImagenPDI) },
    filename: (req, file, cb) => {
        const nombre = req.header('nombre');
        img = nombre + path.extname(file.originalname).toLocaleLowerCase();
        console.log('EL NOMBRE DE IMAGEN ES: ' + nombre);
        cb(null, img);
    }
});

const storageEvento = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, folderImagenEvento) },
    filename: (req, file, cb) => {
        const nombre = req.header('nombre');
        img = nombre + path.extname(file.originalname).toLocaleLowerCase();
        console.log('EL NOMBRE DE IMAGEN ES: ' + nombre);
        cb(null, img);
    }
});

const uploadIMGPDI = multer({
    storage: storagePDI,
    dest: './imagenes',
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const minetype = filetypes.test((file.mimetype).toLowerCase());
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (minetype && extname) { return cb(null, true); }
        cb("Error: Archivo debe ser una imagen valida");
    }
})

const uploadIMGEvento = multer({
    storage: storageEvento,
    dest: './imagenes',
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const minetype = filetypes.test((file.mimetype).toLowerCase());
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (minetype && extname) { return cb(null, true); }
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
    getImagenesPDI,
    getImagenesEvento,
    postImagenes,
    uploadIMGEvento,
    uploadIMGPDI,
    getImagenPDI,
    getImagenEvento,
    createHorarios
}
