const {Pool} = require('pg');

const pool= new Pool({
    host:'localhost',
    user:'postgres',
    password: 'postgre',
    database: 'puntosdeinteres',
    port: '5432'
});


const getPDI = (req,res) => {
    const respuesta = pool.query('SELECT * FROM puntodeinteres')
    .then(respuesta => res.status(200).json(respuesta.rows));
};

const createPDI = (req,res) => {
    const {id, nombre, descripcion, categoria, direccion} = req.body;
    const respuesta = pool.query('INSERT INTO puntodeinteres (id, nombre, descripcion, categoria, direccion) VALUES ($1, $2, $3,$4, $5)', [id, nombre, descripcion, categoria, direccion])
    .then(respuesta => console.log(respuesta))
    .then(res.json({
        message: 'Punto de interes agregado con exito',
        body: {
                puntodeinteres: {id, nombre, descripcion, categoria, direccion}
              }
    }))
};

const deletePDI = (req,res) => {
    const id= req.params.id
    const respuesta = pool.query('DELETE FROM puntodeinteres WHERE id = $1',[id] )
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
    const {nombre, categoria} = req.body;
    const respuesta = pool.query('UPDATE puntodeinteres SET nombre=$1, categoria=$2 WHERE id=$3', [nombre, categoria, id])
    .then(respuesta => console.log(respuesta))
    .then(res.json(`Punto de interes ${id} actualizado con exito `));
};




module.exports = {getPDI, createPDI, getPDIByID, deletePDI, updatePDI}