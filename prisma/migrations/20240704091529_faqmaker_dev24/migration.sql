/*
  Warnings:

  - You are about to drop the column `userId` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nodeId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- DropIndex
DROP INDEX "Reaction_userId_nodeId_idx";

-- DropIndex
DROP INDEX "Reaction_userId_nodeId_key";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "ReactionUser" (
    "id" TEXT NOT NULL,
    "reactionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ReactionUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReactionUser_reactionId_userId_idx" ON "ReactionUser"("reactionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReactionUser_reactionId_userId_key" ON "ReactionUser"("reactionId", "userId");

-- CreateIndex
CREATE INDEX "Reaction_nodeId_idx" ON "Reaction"("nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_nodeId_key" ON "Reaction"("nodeId");

-- AddForeignKey
ALTER TABLE "ReactionUser" ADD CONSTRAINT "ReactionUser_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "Reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionUser" ADD CONSTRAINT "ReactionUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
