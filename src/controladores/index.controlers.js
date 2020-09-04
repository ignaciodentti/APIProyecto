const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
//const { } = require('express');
const bcrypt = require('bcryptjs');
//const crypto = require("crypto");
const multer = require("multer");
const path = require('path');
const { } = require('morgan');
const express = require('express');
const app = express();
var fs = require('fs');
const { json } = require('express');
//const { size, result } = require('underscore');

//ésta es la ruta de la carpeta en donde se guardan las imágenes (ruta relativa desde ésta carpeta).
const folderImagen = './src/imagenes/'
const folderImagenPDI = './src/imagenes/PDI/'
const folderImagenPDIAbs = 'C:/Users/nacho/GitHub/Documents/APIProyecto/src/imagenes/PDI/' //REEMPLAZAR CON RUTA DEL SERVIDOR
const folderImagenEvento = './src/imagenes/evento/'
const folderImagenEventoAbs = 'C:/Users/nacho/GitHub/Documents/APIProyecto/src/imagenes/evento/' //REEMPLAZAR CON RUTA DEL SERVIDOR


const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgre',
    database: 'viviconcepcion',
    port: '5432'
});

const getPDI = (_req, res) => {
    pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=true')
        .then(respuesta => {
            /*for (let i = 0; i < respuesta.rows.length; i++) {
                for (let j = 0; j < respuesta.rows[i].imagenes.length; j++) {
                    respuesta.rows[i].imagenes[j] = 'http://localhost:3000/api/pdi/imagen/' + nameFromPath(respuesta.rows[i].imagenes[j]);
                }
            }*/
            res.status(200).json(respuesta.rows);
        });
};

const obtenerPDIPendientes = (req, res) => {
    pool.query('SELECT * FROM puntodeinteres WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createPDI = (req, res) => {
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, imagenes, idhorario } = req.body;
    pool.query('INSERT INTO puntodeinteres (nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, baja, imagenes, lat, long, idhorario) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, baja, imagenes, lat, long, idhorario])
        .then(respuesta => console.log(respuesta))
        .then(res.status(201).json({ message: 'PDI agregado con exito' }));

}

const createHorarios = (req, res) => {
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
    const id = req.params.id;
    pool.query('SELECT * FROM horarios WHERE id = $1 and baja= false', [id])
        .then(respuesta => res.status(200).json(respuesta.rows));
};

const updateHorario = (req, res) => {
    const id = req.params.id;
    const { lunesAp, lunesCie, martesAp, martesCie, miercolesAp, miercolesCie, juevesAp, juevesCie, viernesAp, viernesCie, sabadoAp, sabadoCie, domingoAp, domingoCie } = req.body;
    pool.query('UPDATE horarios SET lunesap=$1, lunescie=$2, martesap=$3, martescie=$4, miercolesap=$5 , miercolescie= $6, juevesap=$7, juevescie=$8, viernesap=$9, viernescie=$10, sabadoap=$11, sabadocie=$12, domingoap=$13, domingocie=$14  WHERE id=$15', [lunesAp, lunesCie, martesAp, martesCie, miercolesAp, miercolesCie, juevesAp, juevesCie, viernesAp, viernesCie, sabadoAp, sabadoCie, domingoAp, domingoCie, id])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204).json(`Horario del ${id} actualizado con exito `));
};

const getPDIByID = (req, res) => {
    const id = req.params.id;
    const respuesta = pool.query('SELECT * FROM puntodeinteres WHERE id = $1 AND aprobado=true and baja=false', [id])
        .then(respuesta => res.json(respuesta.rows));
};

function nameFromPath(str) {
    return str.split('\\').pop().split('/').pop();
}

const deletePDI = (req, res) => {
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
        .then(res.status(204).json(`Punto de interes ${id} eliminado con exito `));

};

const updatePDI = (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, imagenes } = req.body;
    pool.query('UPDATE puntodeinteres SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5, provincia=$6, localidad=$7, telefono=$8, precio=$9, email=$10, aprobado=$11, lat=$12, long=$13, imagenes=$15 WHERE id =$14', [nombre, descripcion, categoria, calle, numero, provincia, localidad, telefono, precio, email, aprobado, lat, long, id, imagenes])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204).json(`Punto de interes ${id} actualizado con exito `));
};

const getEvento = (_req, res) => {
    pool.query('SELECT * FROM eventos WHERE baja=false AND aprobado=true')
        .then(respuesta => {
            /*for (let i = 0; i < respuesta.rows.length; i++) {
                for (let j = 0; j < respuesta.rows[i].imagenes.length; j++) {
                    respuesta.rows[i].imagenes[j] = 'http://localhost:3000/api/evento/imagen/' + nameFromPath(respuesta.rows[i].imagenes[j]);
                }
            }*/
            res.status(200).json(respuesta.rows);
        })
};

const obtenerEventosPendientes = (req, res) => {
    pool.query('SELECT * FROM eventos WHERE baja=false AND aprobado=false')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createEvento = (req, res) => {
    baja = false;
    const { nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, imagenes } = req.body;

    pool.query('INSERT INTO eventos (nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, baja, imagenes) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', [nombre, descripcion, categoria, calle, numero, fechainicio, fechafin, horaapertura, horacierre, provincia, localidad, email, precio, aprobado, lat, long, baja, imagenes])
        .then(respuesta => console.log(respuesta))
        .then(res.status(201).json({ message: 'Evento agregado con exito' }))
};

const deleteEvento = (req, res) => {
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
        .then(res.status(204).json(`Evento ${id} eliminado con exito `));
};

const updateEvento = (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, aprobado, lat, long, imagenes } = req.body;
    pool.query('UPDATE eventos SET nombre=$1, descripcion=$2, categoria=$3, calle=$4, numero=$5 , provincia= $6, localidad=$7, fechainicio=$8, fechafin=$9, horaapertura=$10, horacierre=$11, email=$12, precio=$13, aprobado=$15, lat=$16, long=$17, imagenes=$18  WHERE id=$14', [nombre, descripcion, categoria, calle, numero, provincia, localidad, fechainicio, fechafin, horaapertura, horacierre, email, precio, id, aprobado, lat, long, imagenes])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204).json(`Evento ${id} actualizado con exito `));
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
                    res.status(200).header('Access-Control-Expose-Headers', 'auth-token').json(result.rows[0].privilegios);
                }
                else { res.status(401).json('Contraseña incorrecta') };
            })
        }
    })

};

const getCategoria = (req, res) => {
    pool.query('SELECT * FROM categorias WHERE baja = false AND padre IS NULL')
        .then(respuesta => res.status(200).json(respuesta.rows));
}

const createCategoria = (req, res) => {
    baja = false;
    const { nombre, padre } = req.body;
    pool.query('INSERT INTO categorias (nombre, padre, baja) VALUES ($1, $2, $3)', [nombre, padre, baja])
        .then(respuesta => console.log(respuesta))
        .then(res.status(201).json({
            message: 'Categoria agregada con exito'
        }))
};

const deleteCategoria = (req, res) => {
    const id = req.params.id
    baja = true;
    pool.query('UPDATE categorias SET baja=$1 WHERE id=$2', [baja, id])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204).json(`Categoria ${id} eliminada con exito `));
}

const getSubcategoria = (req, res) => {
    pool.query('SELECT * FROM categorias WHERE baja = false AND NOT padre IS NULL')
        .then(respuesta => res.status(200).json(respuesta.rows));
}


const getImagenPDI = (req, res) => {
    const idImagen = req.params.idImagen;
    pool.query('SELECT * FROM imagenes WHERE id = $1', [idImagen])
        .then((queryRuta) => {
            let rutaImagen = queryRuta.rows[0].ruta;
            let nombreImagen = nameFromPath(rutaImagen);
            res.status(200).sendFile(nombreImagen, { root: './src/imagenes/PDI' });
        })
}

const getImagenEvento = (req, res) => {
    const idImagen = req.params.idImagen;
    pool.query('SELECT * FROM imagenes WHERE id = $1', [idImagen])
        .then((queryRuta) => {
            let rutaImagen = queryRuta.rows[0].ruta;
            let nombreImagen = nameFromPath(rutaImagen)
            res.sendFile(nombreImagen, { root: './src/imagenes/evento' });
        })
}

const createImagenes = (req, res) => {
    const nombre = req.file.filename;
    rutaImg = req.file.destination + req.file.filename;
    pool.query('INSERT INTO imagenes (ruta) VALUES ($1)', [rutaImg])
        .then(respuesta => console.log(respuesta))
        .then(res.status(201).json('Imagen agregada con exito.'));
}

const devolverid = (req, res) => {
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
    let arregloID = req.body;
    for (let index = 0; index < arregloID.length; index++) {
        pool.query('SELECT * FROM imagenes WHERE id = $1', [arregloID[index]])
            .then((queryPath) => {
                pathImagen = folderImagenPDIAbs + nameFromPath(queryPath.rows[0].ruta);
                fs.unlink(pathImagen);
                pool.query('DELETE FROM imagenes WHERE id=$1', [arregloID[index]]);
            })
    }
    res.status(204).json('Imagenes eliminadas con exito');
}

const deleteImagenesEvento = (req, res) => {
    let arregloID = req.body;
    for (let index = 0; index < arregloID.length; index++) {
        pool.query('SELECT * FROM imagenes WHERE id = $1', [arregloID[index]])
            .then((queryPath) => {
                pathImagen = folderImagenEventoAbs + nameFromPath(queryPath.rows[0].ruta);
                fs.unlink(pathImagen);
                pool.query('DELETE FROM imagenes WHERE id=$1', [arregloID[index]]);
            })
    }
    res.status(204).json('Imagenes eliminadas con exito');
}

const getUsuarios = (req, res) => {
    pool.query('SELECT id, username, email, privilegios FROM usuarios WHERE baja=false')
        .then(respuesta => {
            res.status(200).json(respuesta.rows);
        });
}

const deleteUsuario = (req, res) => {
    pool.query('UPDATE usuarios SET baja=true WHERE id=$1', [id])
        .then(respu => console.log(respu))
        .then(res.status(204).json(`Usuario ${id} eliminado con exito `));
}

const updateUsuario = (req, res) => {
    const id = req.params.id;
    const { username, email, password, privilegios } = req.body;
    pool.query('UPDATE usuarios SET username=$1, email=$2, password=$3, privilegios=$4 WHERE id=$5', [username, email, password, privilegios, id])
        .then(respuesta => console.log(respuesta))
        .then(res.status(204).json(`Usuario ${id} actualizado con exito `));
}



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
    updateUsuario
}
