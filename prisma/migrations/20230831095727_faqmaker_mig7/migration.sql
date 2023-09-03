/*
  Warnings:

  - The values [Free,Paid] on the enum `Plan` will be removed. If these variants are still used in the database, this will fail.
  - The values [User,Admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `password` on the `Tenant` table. All the data in the column will be lost.
  - Added the required column `slug` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Plan_new" AS ENUM ('free', 'paid');
ALTER TABLE "Tenant" ALTER COLUMN "plan" TYPE "Plan_new" USING ("plan"::text::"Plan_new");
ALTER TYPE "Plan" RENAME TO "Plan_old";
ALTER TYPE "Plan_new" RENAME TO "Plan";
DROP TYPE "Plan_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('user', 'admin');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_nodeId_fkey";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "tenantId" TEXT NOT NULL,
ALTER COLUMN "nodeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateIndex
CREATE INDEX "Tag_tenantId_idx" ON "Tag"("tenantId");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
