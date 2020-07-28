const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { request } = require('express');
const bcrypt = require('bcryptjs');
const { size, result } = require('underscore');

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
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE baja = false AND categoria LIKE $1 AND aprobado=true', [categoriabuscar])
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const obtenerPDIPendientes = (req, res) => {
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createPDI = (req, res) => {
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, horaApertura, horaCierre, precio, email, aprobado } = req.body;
    const respuesta = pool.query('INSERT INTO puntodeinteres (nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, horaApertura, horaCierre, precio, email, aprobado, baja) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, horaApertura, horaCierre, precio, email, aprobado, baja])
        .then(respuesta => console.log(respuesta))
        .then(res.json({
            message: 'Punto de interes agregado con exito',
            body: {
                puntodeinteres: { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, horaApertura, horaCierre, precio, email, aprobado }
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
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, horaApertura, horaCierre, precio, email, aprobado } = req.body;
    const respuesta = pool.query('UPDATE puntodeinteres SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, telefono=$5, horaApertura=$6, horaCierre=$7, precio=$8, provincia=$9, localidad=$10, email=$11, numero=$12, aprobado=$14 WHERE id=$13', [nombre, descripcion, categoria, calle, telefono, horaApertura, horaCierre, precio, provincia, localidad, email, numero, id, aprobado])
        .then(respuesta => console.log(respuesta))
        .then(res.json(`Punto de interes ${id} actualizado con exito `));
};

const getEvento = (_req, res) => {
    const respuesta = pool.query('SELECT * FROM eventos WHERE baja=false AND aprobado=true')
        .then(respuesta => res.status(200).json(respuesta.rows));
};

const obtenerEventosPorCategoria = (req, res) => {
    const categoriabuscar = req.params.category;
    const respuesta = pool.query('SELECT * FROM eventos WHERE baja = false AND categoria LIKE $1 AND aprobado=true', [categoriabuscar])
        .then(respuesta => res.status(200).json(respuesta.rows));
}


const obtenerEventosPendientes = (req, res) => {
    const respuesta = pool.query('SELECT * FROM eventos WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createEvento = (req, res) => {
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, fechaInicio, fechaFin, horaApertura, horaCierre, provincia, localidad, email, precio, aprobado } = req.body;
    const respuesta = pool.query('INSERT INTO eventos (nombre, descripcion, categoria, calle, numero, fechaInicio, fechaFin, horaApertura, horaCierre, provincia, localidad, email, precio, aprobado, baja) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)', [nombre, descripcion, categoria, calle, numero, fechaInicio, fechaFin, horaApertura, horaCierre, provincia, localidad, email, precio, aprobado, baja])
        .then(respuesta => console.log(respuesta))
        .then(res.json({
            message: 'Evento agregado con exito',
            body: {
                evento: { nombre, descripcion, categoria, fechaInicio, fechaFin, horaApertura, horaCierre, precio }
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
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, aprobado } = req.body;
    const respuesta = pool.query('UPDATE eventos SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5 , provincia= $6, localidad=$7, fechainicio=$8, fechafin=$9, horaapertura=$10, horacierre=$11, email=$12, precio=$13, aprobado=$15  WHERE id=$14', [nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, id, aprobado])
        .then(respuesta => console.log(respuesta))
        .then(res.json(`Evento ${id} actualizado con exito `));
};

const signup = (req, res) => {
    baja = false;
    let salt;
    pool.query("SELECT id from usuarios where baja=false order by id desc", (err, result) => {
        if (result.rows[0] == null) { tam = 1 }
        else { tam = result.rows[0].id + 1 }
        const { username, password, email, privilegios } = req.body;
        salt = bcrypt.genSalt(3, function (err, data) {
            salt = data;
            console.log('data: ' + data);
            console.log('salt: ' + salt);
            console.log('tam:  ' + tam);
            bcrypt.hash(password, salt, function (err, data) {
                if (data) {
                    passwordEncriptada = data;
                    const respuesta = pool.query('INSERT INTO usuarios (username, email ,password , baja, privilegios) VALUES ($1, $2, $3, $4, $5)', [username, email, passwordEncriptada, baja, privilegios])
                        .then(respuesta => console.log(respuesta))
                        .then(token = jwt.sign(tam, process.env.SECRET_KEY || 'tokentest'/*, {expiresIn: 60*60}*/))
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
    });
};

const signin = (req, res) => {
    username = req.body.username;
    pool.query('SELECT * from usuarios WHERE username= $1', [username], (err, result) => {
        if (result.rows[0] == null) {
            res.status(400).json('Username incorrecto')
        }
        else {
            tam = result.rows[0].id;
            bcrypt.compare(req.body.password, result.rows[0].password, function (err, data) {
                if (data) {
                    console.log('comparacion exitosa');
                    token = jwt.sign(tam, process.env.SECRET_KEY || 'tokentest');
                    res.header('auth-token', token);
                    res.status(200).header('Access-Control-Expose-Headers', 'auth-token').json(result.rows[0].privilegios);
                }
                else { res.status(400).json('Contraseña incorrecta') };
            })
        }
    })

};

const profile = (req, res) => {
    res.send('Perfil')
    console.log('token en profile: ' + req.token);
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
    profile,
    getCategoria,
    createCategoria,
    deleteCategoria,
    getSubcategoria,
    obtenerEventosPendientes,
    obtenerPDIPendientes
}
