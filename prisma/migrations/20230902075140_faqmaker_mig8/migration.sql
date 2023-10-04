/*
  Warnings:

  - You are about to drop the column `userId` on the `Node` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nodeId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodeId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Node" DROP CONSTRAINT "Node_userId_fkey";

-- DropIndex
DROP INDEX "Node_userId_idx";

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "nodeId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Answer_userId_idx" ON "Answer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_nodeId_key" ON "Question"("nodeId");

-- CreateIndex
CREATE INDEX "Question_nodeId_idx" ON "Question"("nodeId");

-- CreateIndex
CREATE INDEX "Question_userId_idx" ON "Question"("userId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
