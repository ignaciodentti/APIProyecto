create database viviconcepcion;

create table puntoDeInteres(
    id serial NOT NULL PRIMARY KEY,
    nombre varchar,
    descripcion text null,
    categoria numeric,
    calle varchar,
    numero varchar null,
    provincia varchar, 
    localidad varchar, 
    telefono varchar NULL,
    precio numeric null,
    email varchar null,
    baja boolean, 
    aprobado boolean,
    lat varchar, 
    long varchar, 
    imagenes varchar[],
    idhorario numeric
 );

create table eventos(
    id serial NOT NULL PRIMARY KEY,
    nombre varchar, 
    descripcion text null,
    categoria numeric,
    calle varchar,
    numero varchar null,
    provincia varchar, 
    localidad varchar,   
    fechainicio varchar null,
    fechafin varchar null,  
    horaapertura varchar null,
    horacierre varchar NULL,
    precio numeric null,
    email varchar null,
    baja boolean, 
    aprobado boolean,
    lat varchar, 
    long varchar,
    imagenes varchar[]
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
    padre numeric null,
    baja boolean
);

create table horarios(

    id serial not null PRIMARY KEY,
    lunesAp varchar,
    lunesCie varchar, 
    martesAp varchar,
    martesCie varchar,
    miercolesAp varchar,
    miercolesCie varchar,
    juevesAp varchar,
    juevesCie varchar,
    viernesAp varchar,
    viernesCie varchar,
    sabadoAp varchar,
    sabadoCie varchar,
    domingoAp varchar,
    domingoCie varchar,
    baja boolean
);

create table imagenes(
    id serial not null PRIMARY KEY,
    ruta varchar
);

INSERT INTO usuarios(username, password, baja)	VALUES ('administrador', '$2a$04$uM4ZutIhMG434GSVJPRPUO57VtCSXYs.vjYLXhFjEDL9UFPufyDp.', false);