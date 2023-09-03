/*
  Warnings:

  - You are about to drop the column `nodeId` on the `Question` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Question_nodeId_idx";

-- DropIndex
DROP INDEX "Question_nodeId_key";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "nodeId";
