/*
  Warnings:

  - A unique constraint covering the columns `[logo]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "logo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_logo_key" ON "Tenant"("logo");
