const cors = require('cors');
const express = require('express');
const app= express();

app.use(cors({ origin: true }));

app.listen(3000);
console.log('Server on port 3000');
app.set('json spaces', 2);


//middelwares
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//rutas
app.use(require('./rutas/index'));
app.use('/api',require('./rutas/index'));

