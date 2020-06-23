const {Pool} = require('pg');

const pool= new Pool({
    host:'localhost',
    user:'postgres',
    password: 'nadia1998',
    database: 'puntosdeinteres',
    port: '5432'
});


const getPDI = (req,res) => {
    const respuesta = pool.query('SELECT * FROM puntodeinteres')
    .then(respuesta => res.status(200).json(respuesta.rows));
};

const createPDI = (req,res) => {
    const {nombre, descripcion, categoria, direccion, telefono, horaApertura, horaCierre, precio } = req.body;
    const respuesta = pool.query('INSERT INTO puntodeinteres ( nombre, descripcion, categoria, direccion, telefono, horaApertura, horaCierre, precio) VALUES ( $1, $2,$3, $4, $5, $6, $7, $8)', [ nombre, descripcion, categoria, direccion, telefono, horaApertura, horaCierre, precio])
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
    const {nombre, descripcion, categoria, direccion, telefono, horaApertura, horaCierre, precio } = req.body;
    const respuesta = pool.query('UPDATE puntodeinteres SET nombre=$1, descripcion=$2, categoria=$3, direccion=$4, telefono=$5, horaApertura=$6, horaCierre=$7, precio=$8  WHERE id=$9', [ nombre,  descripcion,categoria, direccion,telefono, horaApertura, horaCierre, precio, id])
    .then(respuesta => console.log(respuesta))
    .then(res.json(`Punto de interes ${id} actualizado con exito `));
};


module.exports = {getPDI, createPDI, getPDIByID, deletePDI, updatePDI}