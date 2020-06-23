create database puntosDeInteres;

create table puntoDeInteres(
    id serial NOT NULL PRIMARY KEY,
    nombre text,
    descripcion text,
    categoria text,
    direccion text ,
    telefono text NULL,
    horaApertura time NULL,
    horaCierre time NULL,
    precio number NULL
 );

insert into puntoDeInteres values
    ('1','bartolo', 'bar resto', 'comida', 'san martin y 3 de febrero');