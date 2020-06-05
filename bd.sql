create database puntosDeInteres;

create table puntoDeInteres(
    id int,
    nombre text,
    descripcion text,
    categoria text,
    direccion text
);

insert into puntoDeInteres values
    ('1','bartolo', 'bar resto', 'comida', 'san martin y 3 de febrero');