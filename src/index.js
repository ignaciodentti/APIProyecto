const express = require('express');
const app= express();

app.listen(3000);
console.log('Server on port 3000');


//middelwares
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//rutas
app.use(require('./rutas/index'));

