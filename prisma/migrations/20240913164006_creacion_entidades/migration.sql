-- CreateTable
CREATE TABLE "articulo" (
    "id" TEXT NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "codigo" VARCHAR(64),
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "precio_venta" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminado" TEXT NOT NULL DEFAULT 'NO',

    CONSTRAINT "articulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "estado" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminado" TEXT NOT NULL DEFAULT 'NO',

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "rol" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "tipo_documento" VARCHAR(20),
    "num_documento" VARCHAR(20),
    "direccion" VARCHAR(70),
    "telefono" VARCHAR(20),
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminado" TEXT NOT NULL DEFAULT 'NO',

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona" (
    "id" TEXT NOT NULL,
    "tipo_persona" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "tipo_documento" VARCHAR(20),
    "num_documento" VARCHAR(20),
    "direccion" VARCHAR(70),
    "telefono" VARCHAR(20),
    "email" VARCHAR(50),
    "estado" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eliminado" TEXT NOT NULL DEFAULT 'NO',

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingreso" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "tipo_comprobante" VARCHAR(20) NOT NULL,
    "serie_comprobante" VARCHAR(7),
    "num_comprobante" VARCHAR(10) NOT NULL,
    "impuesto" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_ingreso" (
    "id" TEXT NOT NULL,
    "articulo" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "ingresoId" TEXT NOT NULL,

    CONSTRAINT "detalle_ingreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venta" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "tipo_comprobante" VARCHAR(20) NOT NULL,
    "serie_comprobante" VARCHAR(7),
    "num_comprobante" VARCHAR(10) NOT NULL,
    "impuesto" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "estado" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_venta" (
    "id" TEXT NOT NULL,
    "articulo" VARCHAR(255) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL,
    "ventaId" TEXT NOT NULL,

    CONSTRAINT "detalle_venta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articulo_nombre_key" ON "articulo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_nombre_key" ON "categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nombre_key" ON "usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_username_key" ON "usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "persona_nombre_key" ON "persona"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "persona_email_key" ON "persona"("email");

-- AddForeignKey
ALTER TABLE "articulo" ADD CONSTRAINT "articulo_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingreso" ADD CONSTRAINT "ingreso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingreso" ADD CONSTRAINT "ingreso_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_ingreso" ADD CONSTRAINT "detalle_ingreso_ingresoId_fkey" FOREIGN KEY ("ingresoId") REFERENCES "ingreso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_venta" ADD CONSTRAINT "detalle_venta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
