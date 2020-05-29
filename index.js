const express = require('express');
const app= express();
const morgan = require('morgan');

const {Pool} = require('pg');

const config = {
    host:'localhost',
    user:'postgres',
    password: 'nadia1998',
    database: 'puntosdeinteres',
    port: '5432'
};

const pool = new Pool(config);


//setting
app.set('port', process.env.PORT || 3000);
app.set('json space', 2);


//middelwares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.listen(app.get('port'), () => {
    console.log (`Server on port ${app.get('port')}`);
});


const agregarPuntodeInteres = (values) => {
    try {
        const text = 'insert into puntodeinteres(nombre, descripcion, categoria, direccion) values($1, $2, $3, $4)';
        //const values = ['PlazaColumna2', 'descripcion2', 'plaza', '25 de agosto y peron']; //lo sacamos de los componentes

        const res = pool.query(text, values)
        .then(res => console.log(res));
        pool.end();
     } catch (error) {
        console.log(error);
    }
}

agregarPuntodeInteres(['PlazaColumna2', 'descripcion2', 'plaza', '25 de agosto y peron']);


module.exports= {agregarPuntodeInteres}