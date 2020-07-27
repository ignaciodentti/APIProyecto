create database ViviConcepcion;

create table puntoDeInteres(
    id serial NOT NULL PRIMARY KEY,
    nombre varchar,
    descripcion text null,
    categoria text,
    calle text,
    numero text null,
    provincia text, 
    localidad text, 
    telefono text NULL,
    horaApertura time NULL,
    horaCierre time NULL,
    precio numeric null,
    email text null,
    baja boolean, 
    aprobado boolean
 );

create table eventos(
    id serial NOT NULL PRIMARY KEY,
    nombre text, 
    descripcion text null,
    categoria text,
    calle text,
    numero text null,
    provincia text, 
    localidad text,   
    fechaInicio date null,
    fechaFin date null,  
    horaApertura time null,
    horaCierre time NULL,
    precio numeric null,
    email text null,
    baja boolean, 
    aprobado boolean
);

create table usuarios(
    id serial not null PRIMARY KEY,
    username text not null,
    email text, 
    password text not null,
    baja boolean
);

create table categorias(
    id serial PRIMARY KEY,
    nombre text not null,
    padre text null,
    baja boolean
);