/*
  Warnings:

  - You are about to drop the column `questionId` on the `Node` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nodeId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nodeId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Node" DROP CONSTRAINT "Node_questionId_fkey";

-- DropIndex
DROP INDEX "Node_questionId_idx";

-- DropIndex
DROP INDEX "Node_questionId_key";

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "questionId";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "nodeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Question_nodeId_key" ON "Question"("nodeId");

-- CreateIndex
CREATE INDEX "Question_nodeId_idx" ON "Question"("nodeId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
