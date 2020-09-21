create database viviconcepcion;

create table puntoDeInteres(
    id serial NOT NULL PRIMARY KEY,
    nombre varchar,
    descripcion text null,
    categoria numeric,
    calle text,
    numero text null,
    provincia text, 
    localidad text, 
    telefono text NULL,
    precio numeric null,
    email text null,
    baja boolean, 
    aprobado boolean,
    lat text, 
    long text, 
    imagenes text[],
    idhorario numeric
 );

create table eventos(
    id serial NOT NULL PRIMARY KEY,
    nombre text, 
    descripcion text null,
    categoria numeric,
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
    baja boolean, 
    nombre text, 
    apellido text
);

create table categorias(
    id serial not null PRIMARY KEY,
    nombre character varying not null,
    padre numeric null,
    baja boolean
);

create table horarios(

    id serial not null PRIMARY KEY,
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
    domingoCie text,
    baja boolean
);

create table imagenes(
    id serial not null PRIMARY KEY,
    ruta text
);

INSERT INTO usuarios(username, password, baja, nombre,apellido)	VALUES ('administrador', '$2a$04$uM4ZutIhMG434GSVJPRPUO57VtCSXYs.vjYLXhFjEDL9UFPufyDp.', false, 'administrador', 'administrador');