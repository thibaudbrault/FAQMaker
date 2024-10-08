/*
  Warnings:

  - You are about to drop the column `domain` on the `Tenant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,logo,customerId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tenant_email_domain_logo_customerId_key";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "domain";

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_logo_customerId_key" ON "Tenant"("email", "logo", "customerId");
