/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[logo]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tenant_email_logo_customerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_key" ON "Tenant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_logo_key" ON "Tenant"("logo");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_customerId_key" ON "Tenant"("customerId");
