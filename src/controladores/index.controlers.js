const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require("multer");
const path = require('path');
const { } = require('morgan');
const express = require('express');
const app = express();
var fs = require('fs');
const { json } = require('express');


//esta es la ruta de la carpeta en donde se guardan las imágenes (ruta relativa desde ésta carpeta).
const folderImagen = './src/imagenes/'
const folderImagenPDI = './src/imagenes/PDI/'
const folderImagenPDIAbs = 'C:/Users/nadia/Documents/APIProyecto/src/imagenes/PDI/' //REEMPLAZAR CON RUTA DEL SERVIDOR
const folderImagenEvento = './src/imagenes/evento/'
const folderImagenEventoAbs = 'C:/Users/nadia/Documents/APIProyecto/src/imagenes/evento/' //REEMPLAZAR CON RUTA DEL SERVIDOR


const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'nadia1998',
    database: 'viviconcepcion',
    port: '5432'
});


const getPDI = (_req, res) => {
    console.log('getPDI');
    pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=true')
        .then(respuesta => {
            res.status(200).json(respuesta.rows);
        });
};

const obtenerPDIPendientes = (req, res) => {
    console.log('obtenerPDIPendientes');
    pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createPDI = (req, res) => {
    console.log('createPDI');
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, imagenes, idhorario } = req.body;
    pool.query('INSERT INTO puntodeinteres (nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, baja, imagenes, lat, long, idhorario) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, baja, imagenes, lat, long, idhorario])
        .then(respuesta => console.log(respuesta))
        .then(res.status(201).json({ message: 'PDI agregado con exito' }));

}

const createHorarios = (req, res) => {
    console.log('createHorario');
    baja = false;
    const { lunesAp, lunesCie, martesAp, martesCie, miercolesAp, miercolesCie, juevesAp, juevesCie, viernesAp, viernesCie, sabadoAp, sabadoCie, domingoAp, domingoCie } = req.body
    pool.query('INSERT INTO horarios (lunesAp , lunesCie , martesAp ,martesCie ,miercolesAp ,miercolesCie ,juevesAp ,juevesCie ,viernesAp ,viernesCie ,sabadoAp ,sabadoCie ,domingoAp ,domingoCie, baja) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)', [lunesAp, lunesCie, martesAp, martesCie, miercolesAp, miercolesCie, juevesAp, juevesCie, viernesAp, viernesCie, sabadoAp, sabadoCie, domingoAp, domingoCie, baja])
        .then(respuesta => console.log(respuesta))
        .then(pool.query('SELECT * FROM horarios ORDER BY id desc limit 1')
            .then(resp => {
                app.locals.idhorario = resp.rows[0].id;
                res.status(200).json({
                    id: app.locals.idhorario
                });
                app.locals.idhorario = '';
            }
            ))
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
        .then(res.status(204));
};

const getPDIByID = (req, res) => {
    console.log('getPDIbyID');
    const id = req.params.id;
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE id = $1 AND aprobado=true and baja=false', [id])
        .then(respuesta => res.json(respuesta.rows));
};

function nameFromPath(str) {
    return str.split('\\').pop().split('/').pop();
}

const deletePDI = (req, res) => {
    console.log('deletePDI');
    const id = req.params.id;
    pool.query('SELECT imagenes FROM puntodeinteres WHERE id =$1', [id])
        .then((query) => {
            for (let index = 0; index < query.rows[0].imagenes.length; index++) {
                const queryPath = pool.query('SELECT * FROM imagenes WHERE id = $1', [query.rows[0].imagenes[index]])
                    .then((queryPath) => {
                        pathImagen = folderImagenPDIAbs + nameFromPath(queryPath.rows[0].ruta);
                        fs.unlink(pathImagen);
                    })
            }
        })

    pool.query('SELECT * FROM puntodeinteres WHERE id =$1', [id])
        .then((respuesta) => {
            pool.query('UPDATE horarios SET baja=true WHERE id=$1', [respuesta.rows[0].idhorario])
            for (let index = 0; index < respuesta.rows[0].imagenes.length; index++) {
                pool.query('DELETE FROM imagenes WHERE id=$1', [respuesta.rows[0].imagenes[index]]);
            };
        });
    pool.query('UPDATE puntodeinteres SET baja=true WHERE id=$1', [id])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204));

};

const updatePDI = (req, res) => {
    console.log('UpdatePDI');
    const id = req.params.id;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, imagenes } = req.body;
    pool.query('UPDATE puntodeinteres SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5, provincia=$6, localidad=$7, telefono=$8, precio=$9, email=$10, aprobado=$11, lat=$12, long=$13, imagenes=$15 WHERE id =$14', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, id, imagenes])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204));
};

const getEvento = (_req, res) => {
    console.log('getEvento');
    pool.query('SELECT * FROM eventos WHERE baja=false AND aprobado=true')
        .then(respuesta => {
            res.status(200).json(respuesta.rows);
        })
};

const obtenerEventosPendientes = (req, res) => {
    console.log('ObtenerEventosPendientes');
    pool.query('SELECT * FROM eventos WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createEvento = (req, res) => {
    console.log('createEvento');
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, imagenes } = req.body;

    pool.query('INSERT INTO eventos (nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, baja, imagenes) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', [nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, baja, imagenes])
        .then(respuesta => console.log(respuesta))
        .then(res.status(201).json({ message: 'Evento agregado con exito' }))
};

const deleteEvento = (req, res) => {
    console.log('deleteEvento');
    const id = req.params.id
    pool.query('SELECT imagenes FROM eventos WHERE id =$1', [id])
        .then((query) => {
            for (let index = 0; index < query.rows[0].imagenes.length; index++) {
                const queryPath = pool.query('SELECT * FROM imagenes WHERE id = $1', [query.rows[0].imagenes[index]])
                    .then((queryPath) => {
                        pathImagen = folderImagenEventoAbs + nameFromPath(queryPath.rows[0].ruta);
                        fs.unlink(pathImagen);
                    })
            }
        })


    pool.query('SELECT * FROM eventos WHERE id =$1', [id])
        .then((respuesta) => {
            pool.query('UPDATE horarios SET baja=true WHERE id=$1', [respuesta.rows[0].idhorario])
            for (let index = 0; index < respuesta.rows[0].imagenes.length; index++) {
                pool.query('UPDATE imagenes SET baja=true WHERE id=$1', [respuesta.rows[0].imagenes[index]]);
            };
        })
    pool.query('UPDATE eventos SET baja=true WHERE id=$1', [id])
        .then(respu => console.log(respu))
        .then(res.status(204));
};

const updateEvento = (req, res) => {
    console.log('updateEvento');
    const id = req.params.id;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, aprobado, lat, long, imagenes } = req.body;
    pool.query('UPDATE eventos SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5 , provincia= $6, localidad=$7, fechainicio=$8, fechafin=$9, horaapertura=$10, horacierre=$11, email=$12, precio=$13, aprobado=$15, lat=$16, long=$17, imagenes=$18  WHERE id=$14', [nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, id, aprobado, lat, long, imagenes])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204));
};

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

const getCategoria = (req, res) => {
    console.log('getCategoria');
    pool.query('SELECT * FROM categorias WHERE baja = false AND padre IS NULL')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createCategoria = (req, res) => {
    console.log('createCategoria');
    baja = false;
    const { nombre, padre } = req.body;

    if (padre != null) {
        pool.query('SELECT * FROM categorias WHERE nombre = $1', [padre], (err, respPadre) => {
            if (respPadre.rows[0].padre == null) {
                let IDPadre = respPadre.rows[0].id;
                console.log(IDPadre);
                pool.query('INSERT INTO categorias (nombre, padre, baja) VALUES ($1, $2, $3)', [nombre, IDPadre, false])
                    .then(respuesta => console.log(respuesta))
                    .then(res.status(201).json({
                        message: 'Categoria agregada con exito'
                    }))
            }
            else {
                res.status(400).json('No se pueden agregar subcategorías a una subcategoría.');
            }

        })

    }

    else {
        pool.query('INSERT INTO categorias (nombre, padre, baja) VALUES ($1, $2, $3)', [nombre, null, false])
            .then(respuesta => console.log(respuesta))
            .then(res.status(201).json({
                message: 'Categoria agregada con exito'
            }))

    }
};

const deleteCategoria = (req, res) => {
    console.log('deleteCategoria');
    const id = req.params.id
    pool.query('(SELECT e.id, e.nombre,e.categoria,e.baja FROM eventos e WHERE e.categoria=$1 AND e.baja=false) UNION ALL (SELECT p.id, p.nombre, p.categoria, p.baja FROM puntodeinteres p WHERE p.categoria= $1 AND p.baja=false);', [id], (err, result) => {
        if (result.rows.length == 0) { //no tiene pdi asociados dicha categoria
            pool.query('SELECT * FROM categorias WHERE padre = $1 AND baja = false', [id], (err, resultadoQuery) => {
                if (resultadoQuery.rows.length == 0) {
                    pool.query('UPDATE categorias SET baja=true WHERE id=$1', [id])
                        .then(res.status(204))
                }
                else {
                    res.status(400).json('Error - La categoría no se puede eliminar ya que tiene subcategorías activas.');
                }
            })
        }
        else {
            res.status(400).json('Error - La categoría no se puede eliminar ya que tiene puntos de interes o eventos asociados.');
        }
    })
        
    

}

const getSubcategoria = (req, res) => {
    console.log('getSubCategoria');
    pool.query('SELECT * FROM categorias WHERE baja = false AND NOT padre IS NULL')
        .then(respuesta => {
            res.status(200).json(respuesta.rows);
        });
}

const padreSubCategoria = (req, res) => {
    console.log('padreSubCategoria');
    const id = req.params.id;
    pool.query('SELECT nombre FROM categorias WHERE id= $1', [id])
        .then(respuesta => {
            res.status(200).json(respuesta.rows[0].nombre);
        });
}

const updateCategoria = (req, res) => {
    console.log('updateCategoria');
    const id = req.params.id;
    const { nombre, padre } = req.body;
    pool.query('UPDATE categoria SET nombre=$1, padre=$2 WHERE id=$3', [nombre, padre, id])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204));
};

const getImagenPDI = (req, res) => {
    console.log('getImagenesPDI');
    const idImagen = req.params.idImagen;
    pool.query('SELECT * FROM imagenes WHERE id = $1', [idImagen])
        .then((queryRuta) => {
            let rutaImagen = queryRuta.rows[0].ruta;
            let nombreImagen = nameFromPath(rutaImagen);
            res.status(200).sendFile(nombreImagen, { root: './src/imagenes/PDI' });
        })
}

const getImagenEvento = (req, res) => {
    console.log('getImagenesEvento');
    const idImagen = req.params.idImagen;
    pool.query('SELECT * FROM imagenes WHERE id = $1', [idImagen])
        .then((queryRuta) => {
            let rutaImagen = queryRuta.rows[0].ruta;
            let nombreImagen = nameFromPath(rutaImagen)
            res.sendFile(nombreImagen, { root: './src/imagenes/evento' });
        })
}

const createImagenes = (req, res) => {
    console.log('CreateImagenes');
    const nombre = req.file.filename;
    rutaImg = req.file.destination + req.file.filename;
    pool.query('INSERT INTO imagenes (ruta) VALUES ($1)', [rutaImg])
        .then(respuesta => console.log(respuesta))
        .then(res.status(201).json('Imagen agregada con exito.'));
}

const devolverid = (req, res) => {
    console.log('DevolverID');
    pool.query('SELECT * FROM imagenes ORDER BY id desc limit 1')
        .then(respu => {
            res.status(200).json({
                id: respu.rows[0].id
            });
        });
}

const storagePDI = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, folderImagenPDI) },
    filename: (req, file, cb) => {
        img = Date.now() + path.extname(file.originalname).toLocaleLowerCase();
        cb(null, img);
    }
})

const storageEvento = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, folderImagenEvento) },
    filename: (req, file, cb) => {
        img = Date.now() + path.extname(file.originalname).toLocaleLowerCase();
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

const deleteImagenesPDI = (req, res) => {
    console.log('deleteImagenesPDI');
    let arregloID = req.body;
    for (let index = 0; index < arregloID.length; index++) {
        pool.query('SELECT * FROM imagenes WHERE id = $1', [arregloID[index]])
            .then((queryPath) => {
                pathImagen = folderImagenPDIAbs + nameFromPath(queryPath.rows[0].ruta);
                fs.unlink(pathImagen);
                pool.query('DELETE FROM imagenes WHERE id=$1', [arregloID[index]]);
            })
    }
    res.status(204);
}

const deleteImagenesEvento = (req, res) => {
    console.log('deleteImagenesEvento');
    let arregloID = req.body;
    for (let index = 0; index < arregloID.length; index++) {
        pool.query('SELECT * FROM imagenes WHERE id = $1', [arregloID[index]])
            .then((queryPath) => {
                pathImagen = folderImagenEventoAbs + nameFromPath(queryPath.rows[0].ruta);
                fs.unlink(pathImagen);
                pool.query('DELETE FROM imagenes WHERE id=$1', [arregloID[index]]);
            })
    }
    res.status(204);
}

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
        .then(res.status(204));
}

const updateUsuario = (req, res) => {
    console.log('updateUsuario');
    const id = req.params.id;
    const hashear = req.header('hashear');
    const { username, email, password, privilegios, nombre, apellido } = req.body;
    if (hashear == 'true') {
        salt = bcrypt.genSalt(3, function (err, data) {
            salt = data;
            console.log(salt)
            bcrypt.hash(password, salt, function (err) {
                if (data) {
                    passwordEncriptada = data;
                    console.log(passwordEncriptada);
                    pool.query('UPDATE usuarios SET username=$1, email=$2, password=$3, privilegios=$4, nombre=$6, apellido=$7 WHERE id=$5', [username, email, passwordEncriptada, privilegios, id, nombre, apellido])
                        .then(respuesta => console.log(respuesta))
                        .then(res.status(204));

                }
            })
        })
    }
    else {
        pool.query('UPDATE usuarios SET username=$1, email=$2, password=$3, privilegios=$4, nombre=$6, apellido=$7 WHERE id=$5', [username, email, password, privilegios, id, nombre, apellido])
            .then(respuesta => console.log(respuesta))
            .then(res.status(204));
    }
}

const getCategoriaByNombre = (req, res) => {
    console.log('getCategoriaByNombre');
    const nombre = req.params.nombre;
    const respuesta = pool.query('SELECT id FROM categorias WHERE nombre = $1 and baja=false', [nombre])
        .then(respuesta => res.json(respuesta.rows[0]));
};

const getCategoriaById = (req, res) => {
    console.log('getCategoriaById');
    const id = req.params.id;
    console.log()
    console.log(id);
    const respuesta = pool.query('SELECT nombre FROM categorias WHERE id= $1 and baja=false', [id])
        .then(respuesta => res.json(respuesta.rows[0]));
};


module.exports = {
    getPDI,
    createPDI,
    deletePDI,
    updatePDI,
    getEvento,
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
    createImagenes,
    uploadIMGEvento,
    uploadIMGPDI,
    getImagenPDI,
    getImagenEvento,
    createHorarios,
    getHorarioByID,
    updateHorario,
    devolverid,
    deleteImagenesPDI,
    deleteImagenesEvento,
    getPDIByID,
    getUsuarios,
    deleteUsuario,
    updateUsuario,
    updateCategoria,
    padreSubCategoria,
    getCategoriaByNombre,
    getCategoriaById
}
