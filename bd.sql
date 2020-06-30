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
    precio numeric NULL,
    baja boolean
 );

create table eventos(
    id serial NOT NULL PRIMARY KEY,
    nombre text, 
    descripcion text null,
    categoria text,
    direccion text null,  
    fechaInicio date null,
    fechaFin date null,  
    horaApertura time null,
    horaCierre time NULL,
    precio numeric NULL,
    baja boolean
);