const cors = require('cors');
const express = require('express');
const app= express();
const dotenv = require('dotenv');
const path = require ('path');
//const router = require('./rutas');

dotenv.config();
app.use(cors({ origin: true }));

const port= process.env.PORT || 3000;

app.listen(port, () => console.log(`Server on port ${port}`));

app.set('json spaces', 2);

//middelwares (se ejecuta antes de llegar a las rutas)
app.use(express.json());
app.use(express.urlencoded({extended: false}));



//static file
app.use(express.static(path.join(__dirname, 'imagenes')));


//rutas
app.use(require('./rutas/index'));
app.use('/api',require('./rutas/index'));



