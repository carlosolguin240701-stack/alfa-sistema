/*=========================================================
    BASE DE DATOS
    SISTEMA PREVERIFICADORA VEHICULAR
==========================================================*/

DROP DATABASE IF EXISTS cpu;

CREATE DATABASE cpu
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE cpu;
SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS bitacora;
DROP TABLE IF EXISTS detalle_pago;
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS resultados_verificacion;
DROP TABLE IF EXISTS verificaciones;
DROP TABLE IF EXISTS citas;
DROP TABLE IF EXISTS vehiculos;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS tecnicos;
DROP TABLE IF EXISTS lineas_verificacion;
DROP TABLE IF EXISTS sucursales;
DROP TABLE IF EXISTS modelos;
DROP TABLE IF EXISTS marcas;
DROP TABLE IF EXISTS combustibles;
DROP TABLE IF EXISTS tipos_vehiculo;
DROP TABLE IF EXISTS municipios;
DROP TABLE IF EXISTS estados;

SET FOREIGN_KEY_CHECKS=1;
CREATE TABLE estados(

id_estado INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(100) NOT NULL UNIQUE

);
CREATE TABLE municipios(

id_municipio INT AUTO_INCREMENT PRIMARY KEY,

id_estado INT NOT NULL,

nombre VARCHAR(100) NOT NULL,

FOREIGN KEY(id_estado)
REFERENCES estados(id_estado)

);
CREATE TABLE sucursales(

id_sucursal INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(150) NOT NULL,

direccion VARCHAR(250),

telefono VARCHAR(20),

correo VARCHAR(120),

id_municipio INT,

activo BOOLEAN DEFAULT TRUE,

fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(id_municipio)
REFERENCES municipios(id_municipio)

);
CREATE TABLE roles(

id_rol INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(80) UNIQUE,

descripcion VARCHAR(200)

);
CREATE TABLE usuarios(

id_usuario INT AUTO_INCREMENT PRIMARY KEY,

id_rol INT NOT NULL,

nombre VARCHAR(100),

apellido_paterno VARCHAR(100),

apellido_materno VARCHAR(100),

correo VARCHAR(120) UNIQUE,

password VARCHAR(255),

telefono VARCHAR(20),

activo BOOLEAN DEFAULT TRUE,

fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(id_rol)
REFERENCES roles(id_rol)

);
CREATE TABLE tecnicos(

id_tecnico INT AUTO_INCREMENT PRIMARY KEY,

id_usuario INT UNIQUE,

numero_empleado VARCHAR(30) UNIQUE,

especialidad VARCHAR(120),

certificacion VARCHAR(120),

fecha_ingreso DATE,

estatus VARCHAR(30),

FOREIGN KEY(id_usuario)
REFERENCES usuarios(id_usuario)

);
CREATE TABLE marcas(

id_marca INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(100) UNIQUE NOT NULL

);
CREATE TABLE modelos(

id_modelo INT AUTO_INCREMENT PRIMARY KEY,

id_marca INT NOT NULL,

nombre VARCHAR(100),

anio_inicio YEAR,

anio_fin YEAR,

FOREIGN KEY(id_marca)
REFERENCES marcas(id_marca)

);
CREATE TABLE combustibles(

id_combustible INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(50) UNIQUE

);
CREATE TABLE tipos_vehiculo(

id_tipo INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(80),

descripcion VARCHAR(150)

);
CREATE TABLE clientes(

id_cliente INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(100),

apellido_paterno VARCHAR(100),

apellido_materno VARCHAR(100),

telefono VARCHAR(20),

correo VARCHAR(120),

direccion VARCHAR(250),

id_municipio INT,

fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

activo BOOLEAN DEFAULT TRUE,

FOREIGN KEY(id_municipio)
REFERENCES municipios(id_municipio)

);
CREATE TABLE vehiculos(

id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,

id_cliente INT NOT NULL,

id_modelo INT NOT NULL,

id_tipo INT NOT NULL,

id_combustible INT NOT NULL,

placas VARCHAR(15) UNIQUE,

vin VARCHAR(30) UNIQUE,

numero_motor VARCHAR(50),

color VARCHAR(50),

anio YEAR,

numero_serie VARCHAR(50),

kilometraje INT,

fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

activo BOOLEAN DEFAULT TRUE,

FOREIGN KEY(id_cliente)
REFERENCES clientes(id_cliente),

FOREIGN KEY(id_modelo)
REFERENCES modelos(id_modelo),

FOREIGN KEY(id_tipo)
REFERENCES tipos_vehiculo(id_tipo),

FOREIGN KEY(id_combustible)
REFERENCES combustibles(id_combustible)

);
/*=========================================================
        LINEAS DE VERIFICACION
=========================================================*/

CREATE TABLE lineas_verificacion(

id_linea INT AUTO_INCREMENT PRIMARY KEY,

id_sucursal INT NOT NULL,

nombre VARCHAR(50) NOT NULL,

descripcion VARCHAR(150),

estatus ENUM('Disponible','Ocupada','Mantenimiento')
DEFAULT 'Disponible',

fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(id_sucursal)
REFERENCES sucursales(id_sucursal)

);
/*=========================================================
                    CITAS
=========================================================*/

CREATE TABLE citas(

id_cita INT AUTO_INCREMENT PRIMARY KEY,

id_cliente INT NOT NULL,

id_vehiculo INT NOT NULL,

fecha DATE NOT NULL,

hora TIME NOT NULL,

estatus ENUM(
'Pendiente',
'Confirmada',
'Cancelada',
'Finalizada'
) DEFAULT 'Pendiente',

observaciones VARCHAR(300),

fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(id_cliente)
REFERENCES clientes(id_cliente),

FOREIGN KEY(id_vehiculo)
REFERENCES vehiculos(id_vehiculo)

);
/*=========================================================
                VERIFICACIONES
=========================================================*/

CREATE TABLE verificaciones(

id_verificacion INT AUTO_INCREMENT PRIMARY KEY,

id_cita INT,

id_linea INT NOT NULL,

id_tecnico INT NOT NULL,

folio VARCHAR(40) UNIQUE,

fecha_inicio DATETIME,

fecha_fin DATETIME,

tipo_verificacion ENUM(

'Primera',
'Reverificacion',
'Voluntaria',
'Extraordinaria'

),

estatus ENUM(

'En proceso',
'Aprobada',
'Rechazada',
'Cancelada'

) DEFAULT 'En proceso',

observaciones TEXT,

fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(id_cita)
REFERENCES citas(id_cita),

FOREIGN KEY(id_linea)
REFERENCES lineas_verificacion(id_linea),

FOREIGN KEY(id_tecnico)
REFERENCES tecnicos(id_tecnico)

);
/*=========================================================
            RESULTADOS
=========================================================*/

CREATE TABLE resultados_verificacion(

id_resultado INT AUTO_INCREMENT PRIMARY KEY,

id_verificacion INT UNIQUE,

nivel_emisiones DECIMAL(10,2),

temperatura_motor DECIMAL(8,2),

rpm INT,

co DECIMAL(8,2),

co2 DECIMAL(8,2),

hc DECIMAL(8,2),

o2 DECIMAL(8,2),

lambda DECIMAL(8,3),

resultado ENUM(

'Aprobado',
'Rechazado'

),

motivo_rechazo TEXT,

fecha_resultado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(id_verificacion)
REFERENCES verificaciones(id_verificacion)

);
/*=========================================================
        METODOS DE PAGO
=========================================================*/

CREATE TABLE metodos_pago(

id_metodo INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(80) UNIQUE

);
/*=========================================================
                PAGOS
=========================================================*/

CREATE TABLE pagos(

id_pago INT AUTO_INCREMENT PRIMARY KEY,

id_verificacion INT NOT NULL,

id_metodo INT NOT NULL,

monto DECIMAL(10,2),

referencia VARCHAR(100),

fecha_pago DATETIME,

estatus ENUM(

'Pendiente',
'Pagado',
'Cancelado'

) DEFAULT 'Pendiente',

FOREIGN KEY(id_verificacion)
REFERENCES verificaciones(id_verificacion),

FOREIGN KEY(id_metodo)
REFERENCES metodos_pago(id_metodo)

);
/*=========================================================
                FACTURAS
=========================================================*/

CREATE TABLE facturas(

id_factura INT AUTO_INCREMENT PRIMARY KEY,

id_pago INT UNIQUE,

rfc VARCHAR(20),

razon_social VARCHAR(200),

uso_cfdi VARCHAR(50),

folio_fiscal VARCHAR(100),

fecha_factura DATETIME,

subtotal DECIMAL(10,2),

iva DECIMAL(10,2),

total DECIMAL(10,2),

FOREIGN KEY(id_pago)
REFERENCES pagos(id_pago)

);
/*=========================================================
                EVIDENCIAS
=========================================================*/

CREATE TABLE evidencias(

id_evidencia INT AUTO_INCREMENT PRIMARY KEY,

id_verificacion INT NOT NULL,

tipo VARCHAR(50),

archivo VARCHAR(255),

descripcion VARCHAR(255),

fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(id_verificacion)
REFERENCES verificaciones(id_verificacion)

);
/*=========================================================
                DOCUMENTOS
=========================================================*/

CREATE TABLE documentos(

id_documento INT AUTO_INCREMENT PRIMARY KEY,

id_vehiculo INT NOT NULL,

tipo_documento VARCHAR(80),

numero_documento VARCHAR(100),

archivo VARCHAR(255),

vigencia DATE,

FOREIGN KEY(id_vehiculo)
REFERENCES vehiculos(id_vehiculo)

);
/*=========================================================
                EMPRESAS
=========================================================*/

CREATE TABLE empresas(

id_empresa INT AUTO_INCREMENT PRIMARY KEY,

razon_social VARCHAR(200),

rfc VARCHAR(20) UNIQUE,

telefono VARCHAR(20),

correo VARCHAR(150),

direccion VARCHAR(250),

id_municipio INT,

fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(id_municipio)
REFERENCES municipios(id_municipio)

);
/*=========================================================
        EMPRESA CLIENTE
=========================================================*/

ALTER TABLE clientes

ADD COLUMN id_empresa INT NULL,

ADD CONSTRAINT fk_cliente_empresa

FOREIGN KEY(id_empresa)

REFERENCES empresas(id_empresa);
/*=========================================================
                BITACORA
=========================================================*/

CREATE TABLE bitacora(

id_bitacora INT AUTO_INCREMENT PRIMARY KEY,

id_usuario INT,

accion VARCHAR(150),

tabla_afectada VARCHAR(100),

registro_id INT,

fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

descripcion TEXT,

FOREIGN KEY(id_usuario)

REFERENCES usuarios(id_usuario)

);
/*=========================================================
                INDICES
=========================================================*/

CREATE INDEX idx_cliente
ON vehiculos(id_cliente);

CREATE INDEX idx_modelo
ON vehiculos(id_modelo);

CREATE INDEX idx_cita
ON verificaciones(id_cita);

CREATE INDEX idx_pago
ON pagos(id_verificacion);

CREATE INDEX idx_tecnico
ON verificaciones(id_tecnico);

CREATE INDEX idx_resultado
ON resultados_verificacion(resultado);

CREATE INDEX idx_placas
ON vehiculos(placas);

CREATE INDEX idx_vin
ON vehiculos(vin);

CREATE INDEX idx_fecha
ON verificaciones(fecha_inicio);
/*=========================================================
        HISTORIAL DE VERIFICACIONES
=========================================================*/

CREATE TABLE historial_verificaciones(

id_historial INT AUTO_INCREMENT PRIMARY KEY,

id_vehiculo INT NOT NULL,

id_verificacion INT NOT NULL,

fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

resultado ENUM(
'Aprobado',
'Rechazado'
),

observaciones TEXT,

FOREIGN KEY(id_vehiculo)
REFERENCES vehiculos(id_vehiculo),

FOREIGN KEY(id_verificacion)
REFERENCES verificaciones(id_verificacion)

);
/*=========================================================
                PERMISOS
=========================================================*/

CREATE TABLE permisos(

id_permiso INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(120) UNIQUE,

descripcion VARCHAR(250)

);
/*=========================================================
        ROLES PERMISOS
=========================================================*/

CREATE TABLE roles_permisos(

id_rol INT,

id_permiso INT,

PRIMARY KEY(id_rol,id_permiso),

FOREIGN KEY(id_rol)
REFERENCES roles(id_rol),

FOREIGN KEY(id_permiso)
REFERENCES permisos(id_permiso)

);
/*=========================================================
        EQUIPOS
=========================================================*/

CREATE TABLE equipos(

id_equipo INT AUTO_INCREMENT PRIMARY KEY,

id_linea INT,

nombre VARCHAR(120),

marca VARCHAR(120),

modelo VARCHAR(120),

numero_serie VARCHAR(100),

fecha_compra DATE,

estatus ENUM(
'Activo',
'Mantenimiento',
'Fuera de servicio'
) DEFAULT 'Activo',

FOREIGN KEY(id_linea)
REFERENCES lineas_verificacion(id_linea)

);
/*=========================================================
        MANTENIMIENTOS
=========================================================*/

CREATE TABLE mantenimientos(

id_mantenimiento INT AUTO_INCREMENT PRIMARY KEY,

id_equipo INT,

fecha DATE,

descripcion TEXT,

responsable VARCHAR(120),

costo DECIMAL(10,2),

FOREIGN KEY(id_equipo)
REFERENCES equipos(id_equipo)

);
/*=========================================================
        INVENTARIO
=========================================================*/

CREATE TABLE inventario(

id_producto INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(120),

descripcion VARCHAR(200),

existencia INT,

precio DECIMAL(10,2),

stock_minimo INT,

fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
/*=========================================================
        MOVIMIENTOS
=========================================================*/

CREATE TABLE movimientos_inventario(

id_movimiento INT AUTO_INCREMENT PRIMARY KEY,

id_producto INT,

tipo ENUM(
'Entrada',
'Salida'
),

cantidad INT,

fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

observaciones VARCHAR(200),

FOREIGN KEY(id_producto)

REFERENCES inventario(id_producto)

);
DELIMITER $$

CREATE TRIGGER trg_historial

AFTER INSERT

ON resultados_verificacion

FOR EACH ROW

BEGIN

INSERT INTO historial_verificaciones(

id_vehiculo,

id_verificacion,

resultado,

observaciones

)

SELECT

c.id_vehiculo,

v.id_verificacion,

NEW.resultado,

NEW.motivo_rechazo

FROM verificaciones v

INNER JOIN citas c

ON v.id_cita=c.id_cita

WHERE v.id_verificacion=NEW.id_verificacion;

END$$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER trg_bitacora_clientes

AFTER INSERT

ON clientes

FOR EACH ROW

BEGIN

INSERT INTO bitacora(

id_usuario,

accion,

tabla_afectada,

registro_id,

descripcion

)

VALUES(

NULL,

'INSERT',

'clientes',

NEW.id_cliente,

'Nuevo cliente registrado'

);

END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE sp_registrar_cita(

IN p_cliente INT,

IN p_vehiculo INT,

IN p_fecha DATE,

IN p_hora TIME

)

BEGIN

INSERT INTO citas(

id_cliente,

id_vehiculo,

fecha,

hora

)

VALUES(

p_cliente,

p_vehiculo,

p_fecha,

p_hora

);

END$$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE sp_buscar_vehiculo(

IN p_placa VARCHAR(15)

)

BEGIN

SELECT *

FROM vehiculos

WHERE placas=p_placa;

END$$

DELIMITER ;
DELIMITER $$

CREATE FUNCTION fn_calcular_iva(

subtotal DECIMAL(10,2)

)

RETURNS DECIMAL(10,2)

DETERMINISTIC

BEGIN

RETURN subtotal*0.16;

END$$

DELIMITER ;
CREATE VIEW vw_vehiculos AS

SELECT

v.id_vehiculo,

v.placas,

v.vin,

m.nombre AS marca,

mo.nombre AS modelo,

c.nombre,

c.apellido_paterno

FROM vehiculos v

INNER JOIN clientes c

ON v.id_cliente=c.id_cliente

INNER JOIN modelos mo

ON v.id_modelo=mo.id_modelo

INNER JOIN marcas m

ON mo.id_marca=m.id_marca;
CREATE VIEW vw_verificaciones AS

SELECT

v.folio,

c.nombre,

c.apellido_paterno,

ve.placas,

r.resultado,

v.fecha_inicio,

v.fecha_fin

FROM verificaciones v

INNER JOIN citas ct

ON v.id_cita=ct.id_cita

INNER JOIN clientes c

ON ct.id_cliente=c.id_cliente

INNER JOIN vehiculos ve

ON ct.id_vehiculo=ve.id_vehiculo

LEFT JOIN resultados_verificacion r

ON v.id_verificacion=r.id_verificacion;
SET GLOBAL event_scheduler=ON;

DELIMITER $$

CREATE EVENT eliminar_citas_antiguas

ON SCHEDULE

EVERY 1 MONTH

DO

BEGIN

DELETE

FROM citas

WHERE estatus='Cancelada'

AND fecha < DATE_SUB(CURDATE(),INTERVAL 1 YEAR);

END$$

DELIMITER ;
SELECT * FROM clientes;

SELECT * FROM vehiculos;

SELECT * FROM verificaciones;

SELECT * FROM pagos;

SELECT * FROM vw_vehiculos;

SELECT * FROM vw_verificaciones;

CALL sp_buscar_vehiculo('ABC123');

SELECT fn_calcular_iva(1000);
/*=========================================================
            DATOS INICIALES
=========================================================*/

INSERT INTO estados(nombre) VALUES
('Aguascalientes'),
('Baja California'),
('Baja California Sur'),
('Campeche'),
('Coahuila'),
('Colima'),
('Chiapas'),
('Chihuahua'),
('Ciudad de México'),
('Durango'),
('Estado de México'),
('Guanajuato'),
('Guerrero'),
('Hidalgo'),
('Jalisco'),
('Michoacán'),
('Morelos'),
('Nayarit'),
('Nuevo León'),
('Oaxaca'),
('Puebla'),
('Querétaro'),
('Quintana Roo'),
('San Luis Potosí'),
('Sinaloa'),
('Sonora'),
('Tabasco'),
('Tamaulipas'),
('Tlaxcala'),
('Veracruz'),
('Yucatán'),
('Zacatecas');
INSERT INTO municipios(id_estado,nombre) VALUES

(9,'Álvaro Obregón'),
(9,'Azcapotzalco'),
(9,'Benito Juárez'),
(9,'Coyoacán'),
(9,'Cuauhtémoc'),

(11,'Ecatepec'),
(11,'Nezahualcóyotl'),
(11,'Naucalpan'),
(11,'Tlalnepantla'),
(11,'Toluca');
INSERT INTO roles(nombre,descripcion) VALUES

('Administrador','Control total'),

('Recepcionista','Agenda de citas'),

('Supervisor','Control de verificaciones'),

('Tecnico','Realiza verificaciones');
INSERT INTO metodos_pago(nombre) VALUES

('Efectivo'),
('Tarjeta'),
('Transferencia'),
('Cheque');
INSERT INTO combustibles(nombre) VALUES

('Gasolina'),

('Diesel'),

('Híbrido'),

('Eléctrico'),

('Gas LP'),

('Gas Natural');
INSERT INTO tipos_vehiculo(nombre,descripcion) VALUES

('Sedán','Automóvil'),

('SUV','Camioneta'),

('Pickup','Camioneta'),

('Motocicleta','Moto'),

('Camión','Carga'),

('Taxi','Servicio Público');
INSERT INTO marcas(nombre) VALUES

('Nissan'),

('Toyota'),

('Volkswagen'),

('Chevrolet'),

('Honda'),

('Mazda'),

('Ford'),

('Hyundai'),

('Kia'),

('BMW');
INSERT INTO modelos(id_marca,nombre,anio_inicio,anio_fin) VALUES

(1,'Versa',2012,NULL),

(1,'Sentra',2010,NULL),

(2,'Corolla',2005,NULL),

(2,'Yaris',2010,NULL),

(3,'Jetta',2000,NULL),

(3,'Vento',2013,NULL),

(4,'Aveo',2010,NULL),

(4,'Onix',2020,NULL),

(5,'Civic',2008,NULL),

(5,'CR-V',2012,NULL);
INSERT INTO usuarios(

id_rol,

nombre,

apellido_paterno,

apellido_materno,

correo,

password,

telefono

)

VALUES

(1,'Carlos','Olguín','López','admin@cpu.com','123456','5511111111'),

(2,'María','Sánchez','Ruiz','recepcion@cpu.com','123456','5522222222'),

(3,'José','Ramírez','Hernández','super@cpu.com','123456','5533333333'),

(4,'Pedro','Martínez','Lozano','tecnico@cpu.com','123456','5544444444');
INSERT INTO tecnicos(

id_usuario,

numero_empleado,

especialidad,

certificacion,

fecha_ingreso,

estatus

)

VALUES

(4,'EMP001','Emisiones','SEMARNAT','2025-01-01','Activo');
INSERT INTO sucursales(

nombre,

direccion,

telefono,

correo,

id_municipio

)

VALUES

(

'Preverificadora Centro',

'Av. Reforma 100',

'5555555555',

'contacto@cpu.com',

3

);
INSERT INTO lineas_verificacion(

id_sucursal,

nombre,

descripcion

)

VALUES

(1,'Línea 1','Gasolina'),

(1,'Línea 2','Diésel');
INSERT INTO clientes(

nombre,

apellido_paterno,

apellido_materno,

telefono,

correo,

direccion,

id_municipio

)

VALUES

('Juan','Pérez','López','5511111111','juan@gmail.com','Calle 1',3),

('Ana','Martínez','Ruiz','5522222222','ana@gmail.com','Calle 2',3),

('Luis','Sánchez','Torres','5533333333','luis@gmail.com','Calle 3',4);
INSERT INTO vehiculos(

id_cliente,

id_modelo,

id_tipo,

id_combustible,

placas,

vin,

numero_motor,

color,

anio,

numero_serie,

kilometraje

)

VALUES

(1,1,1,1,'ABC123','VIN000001','M001','Rojo',2020,'SERIE001',45000),

(2,3,2,1,'XYZ987','VIN000002','M002','Negro',2022,'SERIE002',18000),

(3,5,1,1,'JKL456','VIN000003','M003','Blanco',2019,'SERIE003',65000);