/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Changed the type of `plan` on the `Tenant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('Free', 'Paid');

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "plan",
ADD COLUMN     "plan" "Plan" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Color" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "bg" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Color_tenantId_key" ON "Color"("tenantId");

-- CreateIndex
CREATE INDEX "Color_tenantId_idx" ON "Color"("tenantId");

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
