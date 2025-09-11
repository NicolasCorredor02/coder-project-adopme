# Proyecto Final: AdoptMe API

AdoptMe es una API RESTful para gestionar un centro de adopción de mascotas. Permite a los usuarios registrarse, gestionar mascotas y procesar adopciones. El proyecto está completamente dockerizado para facilitar su despliegue y desarrollo en entornos consistentes.

---

## Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación Local (Sin Docker)](#instalación-local-sin-docker)
- [Descarga de imagen Docker desde DockerHub](#descarga-imagen-dockerhub)
- [Uso con Docker (Recomendado)](#uso-con-docker-recomendado)
- [Documentación de la API](#documentación-de-la-api)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## Tecnologías Utilizadas

- **Backend:** Node.js, Express.js
- **Base de Datos:** MongoDB con Mongoose
- **Autenticación:** JSON Web Tokens (JWT)
- **Contenerización:** Docker, Docker Compose
- **Documentación:** Swagger (OpenAPI)
- **Manejo de Errores:** Winston Logger, Middlewares personalizados
- **Otros:** bcrypt, faker-js, commander

---

## Instalación Local (Sin Docker)

### 1. Prerrequisitos

- Node.js (v18 o superior)
- npm
- Una instancia de MongoDB corriendo localmente o en la nube.

### 2. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd coder-project-adopme
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables, reemplazando los valores de ejemplo:

NOTA: Adicionalmente existe el documento `.env.example` como ejemplo para todas las variables de entorno necesarias.

```env
PORT=8080

# Tu cadena de conexión a MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=coder-project-adopme

# Clave secreta para firmar los JWT
JWT_SECRET_KEY=tu_clave_secreta_super_segura
```

### 5. Ejecutar la Aplicación

Es recomendable crear un archivo `.env.prod` que contenga las variables de entorno especificamente para produccion

```bash
# Para modo desarrollo (con hot-reload gracias a nodemon)
npm run dev

# Para modo producción
npm run prod
```

---
## Descarga de imagen Docker desde DockerHub

Por medio del siguiente enlace podras descargar las imagenes de docker tanto la imagen del entorno de produccion como la imagen de desarrollo:

Imagen de desarrollo: [**click aqui**]()

Imagen de producción: [**click aqui**]()

---

## Uso con Docker (Recomendado)

Este método es el recomendado ya que abstrae la configuración del entorno y las dependencias.

### 1. Prerrequisitos

- Docker
- Docker Compose

### 2. Configurar Archivos de Entorno

**A. Para Desarrollo (`.env.docker`)**

El proyecto utiliza archivos de entorno separados para desarrollo y producción con Docker.

> **Nota Importante:** Para la ejecución con Docker, es crucial crear un archivo `.env.docker` en la raíz del proyecto. Este archivo debe contener las variables de entorno necesarias para que la aplicación se conecte a servicios externos desde el contenedor, como la base de datos.
>
> Un punto clave es la variable `MONGO_URL`. Cuando se ejecuta la aplicación en Docker y la base de datos MongoDB está en la misma máquina (el host), no se puede usar `localhost`. En su lugar, se debe utilizar `host.docker.internal` para permitir que el contenedor Docker se comunique con la base de datos del host.
>
> A continuación se muestra el contenido que debe tener el archivo `.env.docker`:
>
> ```env
> PORT=3000
> MONGO_URL=mongodb://host.docker.internal:27017
> DB_NAME=coder-project-adopme
> JWT_SECRET_KEY=coder-secret
> ```

**B. Para Producción (`.env.prod`)**

Crea un archivo `.env.prod`. En un escenario real, `MONGO_URL` apuntaría a una base de datos en un servidor dedicado o en la nube.

```env
PORT=8080
MONGO_URL=mongodb://usuario:password@servidor.remoto.com/adoptme_prod
DB_NAME=adoptme_prod
JWT_SECRET_KEY=una_clave_diferente_y_mas_segura_para_produccion
```

### 3. Ejecutar los Contenedores

Usa `docker compose` para levantar el servicio deseado.

**A. Crear e Inicio Entorno de Desarrollo**

Este comando creara la imagen (si no existe) del contenedor. Incluye **hot-reloading** para reflejar los cambios en tu código al instante.

```bash
docker compose build coder-adoptme-dev
```

Este comando iniciara el contenedor

```bash
docker compose up -d coder-adoptme-dev
```

**B. Crear e Inicio Entorno de Producción**

```bash
docker compose build coder-adoptme-prod
```

```bash
docker compose up -d coder-adoptme-prod
```

### 4. Detener los Contenedores

Para unicamente detener los contenedores creados por `docker compose`:

```bash
docker compose stop coder-adoptme-dev 
```

```bash
docker compose stop coder-adoptme-prod 
```

Para detener y eliminar los contenedores, redes y volúmenes creados por `docker compose`:

```bash
docker compose down coder-adoptme-dev 
```

```bash
docker compose down coder-adoptme-prod 
```

### 5. Ver Logs

```bash
# Logs del contenedor de desarrollo
docker-compose logs -f coder-adoptme-dev
```

---

## Documentación de la API

Una vez que la aplicación esté corriendo (con o sin Docker), puedes acceder a la documentación interactiva de la API generada con Swagger en la siguiente URL:

Desarrollo: [**http://localhost:3000/api-docs**](http://localhost:3000/api-docs)

Producción: [**http://localhost:8080/api-docs**](http://localhost:8080/api-docs)

---

## Scripts Disponibles

- `npm run prod`: Inicia el servidor en modo producción.
- `npm start`: Inicia el servidor en modo por defecto.
- `npm run dev`: Inicia el servidor en modo desarrollo con `nodemon` para recarga automática.
- `npm test`: Ejecuta las pruebas de la API con Mocha y Supertest.

---

## Test de Integración

El proyecto incluye pruebas de integración para los endpoints de `users` y `pets`. Estas pruebas verifican que los endpoints CRUD (Crear, Leer, Actualizar, Eliminar) funcionen como se espera.

### Ejecutar las Pruebas

Para ejecutar las pruebas, asegúrate de estar en el directorio raíz del proyecto y ejecuta el siguiente comando:

```bash
npx mocha
```

Este comando utilizará Mocha para encontrar y ejecutar los archivos de prueba ubicados en el directorio `test/`.

---

## Estructura del Proyecto

```
src/
├── app.js                # Archivo principal de la aplicación
├── config/               # Configuraciones (DB, variables de entorno, Swagger)
├── controllers/          # Lógica de negocio para las rutas
├── dao/                  # Data Access Objects (interacción directa con la DB)
├── docs/                 # Archivos de especificación OpenAPI (Swagger)
├── dto/                  # Data Transfer Objects (formateo de datos)
├── middlewares/          # Middlewares de Express
├── public/               # Archivos públicos
├── repository/           # Repositorios (abstracción sobre los DAOs)
├── routes/               # Definición de las rutas de la API
├── services/             # Capa de servicio (orquestación)
└── utils/                # Utilidades (logger, custom errors, etc.)
```