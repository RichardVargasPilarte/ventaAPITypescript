/*
  Warnings:

  - You are about to drop the column `articulo` on the `detalle_ingreso` table. All the data in the column will be lost.
  - You are about to drop the column `articulo` on the `detalle_venta` table. All the data in the column will be lost.
  - Added the required column `articuloId` to the `detalle_ingreso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `articuloId` to the `detalle_venta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "detalle_ingreso" DROP COLUMN "articulo",
ADD COLUMN     "articuloId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "detalle_venta" DROP COLUMN "articulo",
ADD COLUMN     "articuloId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "detalle_ingreso" ADD CONSTRAINT "detalle_ingreso_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_venta" ADD CONSTRAINT "detalle_venta_articuloId_fkey" FOREIGN KEY ("articuloId") REFERENCES "articulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
