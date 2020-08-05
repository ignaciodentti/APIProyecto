const cors = require('cors');
const express = require('express');
const app= express();
const dotenv = require('dotenv');
const router = require('./rutas');
const path = require ('path');
const multer = require('multer');
const crypto = require("crypto");


dotenv.config();
app.use(cors({ origin: true }));

app.listen(3000);
console.log('Server on port 3000');
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.set('json spaces', 2);

//middelwares (se ejecuta antes de llegar a las rutas)
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//asigna a la imagen que guarda el nombre original
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/imagenes'),
    filename: (req, file, cb) => {
        cb(null, crypto.randomBytes(16).toString("hex")+ path.extname(file.originalname).toLocaleLowerCase());
    }
})


app.use( multer({
    storage: storage,
    dest: path.join(__dirname, 'public/imagenes'),
    fileFilter: (req,file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const minetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (minetype && extname) { return cb(null,true);}
        cb("Error: Archivo debe ser una imagen valida");
    }
}).single('image'));

//static file
app.use(express.static(path.join(__dirname, 'public')));


//rutas
app.use(require('./rutas/index'));
app.use('/api',require('./rutas/index'));

