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
    precio numeric null,
    email text null,
    baja boolean, 
    aprobado boolean,
    diasAbierto text[] NULL, 
    lat text, 
    long text, 
    imagenes text[]
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
    fechainicio text null,
    fechafin text null,  
    horaapertura text null,
    horacierre text NULL,
    precio numeric null,
    email text null,
    baja boolean, 
    aprobado boolean,
    lat text, 
    long text,
    imagenes text[]
);

create table usuarios(
    id serial not null PRIMARY KEY,
    username text not null UNIQUE,
    email text, 
    password text not null,
    privilegios text[],
    baja boolean
);

create table categorias(
    id serial PRIMARY KEY,
    nombre text not null,
    padre text null,
    baja boolean
);

create table horarios(
    id serial not null PRIMARY KEY,
    idpdi numeric not null,
    lunesAp text,
    lunesCie text, 
    martesAp text,
    martesCie text,
    miercolesAp text,
    miercolesCie text,
    juevesAp text,
    juevesCie text,
    viernesAp text,
    viernesCie text,
    sabadoAp text,
    sabadoCie text,
    domingoAp text,
    domingoCie text
);