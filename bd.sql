create database viviconcepcion;

create table puntoDeInteres(
    id serial NOT NULL PRIMARY KEY,
    nombre varchar,
    descripcion text null,
    categoria integer,
    calle varchar,
    numero varchar null,
    provincia varchar, 
    localidad varchar, 
    telefono varchar NULL,
    precio integer null,
    email varchar null,
    baja boolean, 
    aprobado boolean,
    lat varchar, 
    long varchar, 
    imagenes integer[],
    idhorario integer
 );

create table eventos(
    id serial NOT NULL PRIMARY KEY,
    nombre varchar, 
    descripcion text null,
    categoria integer,
    calle varchar,
    numero varchar null,
    provincia varchar, 
    localidad varchar,   
    fechainicio varchar null,
    fechafin varchar null,  
    horario varchar,
    precio integer null,
    email varchar null,
    baja boolean, 
    aprobado boolean,
    lat varchar, 
    long varchar,
    imagenes integer[]
);

create table usuarios(
    id serial not null PRIMARY KEY,
    username varchar not null UNIQUE,
    email varchar, 
    password varchar not null,
    privilegios varchar[],
    baja boolean, 
    nombre varchar, 
    apellido varchar
);

create table categorias(
    id serial not null PRIMARY KEY,
    nombre character varying not null,
    padre integer null,
    baja boolean
);

create table horarios(
    id serial not null PRIMARY KEY,
    lunes varchar,
    martes varchar,,
    miercoles varchar,
    jueves varchar,
    viernes varchar,
    sabado varchar,
    domingo varchar,
    baja boolean
);

create table imagenes(
    id serial not null PRIMARY KEY,
    ruta varchar
);

INSERT INTO usuarios(username, password, baja, nombre,apellido)	VALUES ('administrador', '$2a$04$uM4ZutIhMG434GSVJPRPUO57VtCSXYs.vjYLXhFjEDL9UFPufyDp.', false, 'administrador', 'administrador');