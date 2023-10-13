/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Tenant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tenant_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "stripeCustomerId",
ADD COLUMN     "customerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_customerId_key" ON "Tenant"("customerId");
