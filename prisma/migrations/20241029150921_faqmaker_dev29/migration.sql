/*
  Warnings:

  - You are about to drop the `Reaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReactionUser` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `customerId` on table `Tenant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_nodeId_fkey";

-- DropForeignKey
ALTER TABLE "ReactionUser" DROP CONSTRAINT "ReactionUser_reactionId_fkey";

-- DropForeignKey
ALTER TABLE "ReactionUser" DROP CONSTRAINT "ReactionUser_userId_fkey";

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "customerId" SET NOT NULL;

-- DropTable
DROP TABLE "Reaction";

-- DropTable
DROP TABLE "ReactionUser";
