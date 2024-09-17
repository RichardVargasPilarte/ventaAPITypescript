# Sistema de Ventas - API REST

Este proyecto es una API REST para un sistema de ventas básico, desarrollado en Node.js utilizando Prisma para la ORM, PostgreSQL como base de datos, y Docker para el despliegue. La API incluye autenticación basada en JWT y protección de rutas por roles (Administrador, Bodeguero y Vendedor).

## Características

- **CRUD completo** para los modelos de:
  - Artículos
  - Categorías
  - Clientes
  - Ingresos
  - Proveedores
  - Ventas
  - Usuarios (con roles)
- **Autenticación** basada en JWT.
- **Protección de rutas** en base a roles de usuario.
- **Docker** para ejecutar la aplicación y la base de datos PostgreSQL en contenedores.
- **Prisma ORM** para la interacción con la base de datos.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (v20 o superior)
- [Docker](https://www.docker.com/get-started)
- [Prisma CLI](https://www.prisma.io/docs/getting-started/quickstart) (opcional)

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el backend.
- **Prisma**: ORM que facilita la interacción con bases de datos relacionales.
- **PostgreSQL**: Base de datos relacional.
- **Docker**: Contenedores para la base de datos y la aplicación.
- **JWT**: Autenticación de usuarios.
- **TypeScript**: Superconjunto de JavaScript que añade tipado estático.

## Instalación y Configuración

### Clonar el Repositorio

```bash
git clone https://github.com/RichardVargasPilarte/ventaAPI.git
cd sistema-ventas-api
```

## Variables de Entorno
Crea un archivo .env en el directorio raíz del proyecto y añade las siguientes variables de entorno:

```bash
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=db_name

DATABASE_URL="postgresql://user:password@127.0.0.1:5432/db_name"
```

## Instalación de Dependencias
Instala las dependencias del proyecto utilizando npm:

```bash
npm install
```

## Configuración con Docker

1- Asegúrate de que Docker está instalado y funcionando.
2- Ejecuta los siguientes comandos para construir y ejecutar la aplicación y la base de datos en contenedores:

```bash
docker-compose up --build
```

## Migraciones de Prisma
Ejecuta las migraciones de la base de datos para crear las tablas:

```bash
npx prisma migrate dev
```

## Generar el Cliente Prisma
Para generar el cliente Prisma que interactuará con la base de datos, ejecuta:

```bash
npx prisma generate
```

## Iniciar la Aplicación
Una vez que los contenedores estén en funcionamiento, puedes iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

La API estará disponible en http://localhost:3000.