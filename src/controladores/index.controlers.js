const {Pool} = require('pg');

const pool= new Pool({
    host:'localhost',
    user:'postgres',
    password: 'nadia1998',
    database: 'firtsapi',
    port: '5432'
});


const getUsers = (req,res) => {
    const respuesta = pool.query('SELECT * FROM users')
    .then(respuesta => res.status(200).json(respuesta.rows));
}

const createUsers = (req,res) => {
    const {name, email} = req.body;
    const respuesta = pool.query('INSERT INTO users {name,email} VALUES ($1, $2)', [name,email]);
    then(respuesta => console.log(respuesta))
    then(res.json({
        message: 'Usuario agregado con exito',
        body: {
                user: (name,email)
              }
    }));
};

const deleteUsers = (req,res) => {
    const id= req.params.id
    const respuesta = pool.query('DELETE FROM users WHERE id = $1',[id] )
    then(respuesta => console.log(respuesta));
    then(res.json(`Usuario ${id} eliminado con exito `));
}

const getUsersByID = (req,res) => {
    const id =req.params.id;
   const respuesta = pool.query('SELECT * FROM users WHERE id = $1', [id])
   then(respuesta => res.json(respuesta.rows));
};

const updateUsers = (req,res) => {
    const id = req.params.id;
    const {name,email } = req.body;
    const respuesta = pool.query('UPDATE users SET name=$1, email=$2 WHERE id=$3', [name,email,id])
    then(respuesta => console.log(respuesta));
    then(res.json(`Usuario ${id} actualizado con exito `));
};




module.exports = {getUsers, createUsers, getUsersByID, deleteUsers, updateUsers}