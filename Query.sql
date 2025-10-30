USE instrucalendar;

CREATE TABLE feriados(
    id Int AUTO_INCREMENT NOT NULL,
    Year Int NOT NULL,
    Month Int NOT NULL,
    Date Int NOT NULL,
    Nombre TEXT NOT NULL,
    Tipo TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE integrantes (
    UUID VARCHAR(36) not null UNIQUE,
    Nombre TEXT NOT NULL,
    Apellido TEXT NOT NULL,
    correo VARCHAR(200) not null UNIQUE,
    Tipo TEXT NOT NULL,
    PRIMARY KEY (UUID)
);

CREATE Table credenciales(
    Id Int AUTO_INCREMENT NOT NULL,
    UUID VARCHAR(36) NOT null UNIQUE,
    password TEXT not null,
    PRIMARY KEY (Id),
    FOREIGN KEY (UUID) REFERENCES integrantes(UUID)
);

DROP TABLE IF EXISTS sesiones;
CREATE TABLE sesiones(
    Id int NOT NULL AUTO_INCREMENT UNIQUE,
    Year int not NULL,
    Month int not null,
    Date int not null,
    Asunto text not null,
    Hora_inicial VARCHAR(5),
    Hora_final VARCHAR(5),
    Periodicidad VARCHAR(100) DEFAULT("Ninguna"),
    Responsable TEXT,
    Correo_responsable TEXT,
    fecha_inicio TEXT,
    Mesas TEXT,
    PRIMARY KEY (Id)
);

DROP TABLE IF EXISTS ticket;
CREATE TABLE ticket(
    id_ticket VARCHAR(21) UNIQUE not null,
    id_session int not null,
    UUID_usuario VARCHAR(36) not null,
    fecha_registro TEXT,
    fecha_cierre TEXT,
    observaciones text,
    image_path text,
    equipos_usados text,
    PRIMARY KEY (id_ticket),
    Foreign Key (id_session) REFERENCES sesiones(Id)
)

DROP TABLE IF EXISTS lab_logs_sessions;

CREATE TABLE lab_logs_sessions(
    id_log INT AUTO_INCREMENT NOT NULL,
    UUID VARCHAR(36) NOT NULL,
    correo TEXT NOT NULL,
    Nombre TEXT NOT NULL,
    Apellido TEXT NOT NULL,
    Resultado TEXT NOT NULL,
    fecha_registro DATETIME DEFAULT(CURRENT_TIME),
    PRIMARY KEY (id_log)
);


insert into feriados(Year, Month, Date, Nombre, Tipo) VALUES
(2025,0,1,"Año Nuevo","Feriado"),
(2025,2,3,"Carnaval","Feriado"),
(2025,2,4,"Carnaval","Feriado"),
(2025,3,18,"Viernes Santo","Feriado"),
(2025,4,1,"Dia del Trabajo","Feriado"),
(2025,4,2,"Día del trabajo","Feriado"),
(2025,7,10,"Primer Grito de independencia","Feriado"),
(2025,7,11,"Primer Grito de independencia","Feriado"),
(2025,9,10,"Independencia de Guayaquil","Feriado"),
(2025,10,4,"Día de los difuntos","Feriado"),
(2025,11,24,"Receso de Navidad","Feriado"),
(2025,11,25,"Receso de Navidad","Feriado"),
(2025,11,26,"Receso de Navidad","Feriado"),
(2025,11,27,"Receso de Navidad","Feriado"),
(2025,11,28,"Receso de Navidad","Feriado"),
(2025,11,29,"Receso de Navidad","Feriado"),
(2025,11,30,"Receso de Navidad","Feriado"),
(2025,11,31,"Receso de Navidad","Feriado"),
(2026,0,1,"Receso de Navidad","Feriado"),
(2026,0,2,"Receso de Navidad","Feriado"),
(2025,10,3,"Independencia de Cuenca","Feriado"),
(2025,10,12,"Jornadas FIEE","Feriado"),
(2025,10,13,"Jornadas FIEE","Feriado"),
(2025,10,14,"Jornadas FIEE","Feriado"),
(2025,11,1,"Integración Politécnica","Feriado"),
(2025,11,2,"Integración Politécnica","Feriado"),
(2025,11,3,"Integración Politécnica","Feriado"),
(2025,11,4,"Integración Politécnica","Feriado"),
(2025,11,5,"Fiestas de Quito","Feriado")

SELECT * FROM ticket INNER JOIN sesiones ON sesiones.`Id` = id_session WHERE fecha_cierre IS NULL;
SELECT * FROM ticket INNER JOIN sesiones ON sesiones.`Id` = id_session WHERE fecha_cierre IS NOT NULL;

SELECT image_path FROM ticket WHERE id_ticket = "00SvvP7kanzeayoWKdkNu";