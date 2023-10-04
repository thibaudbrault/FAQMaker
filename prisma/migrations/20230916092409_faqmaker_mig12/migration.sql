/*
  Warnings:

  - You are about to drop the column `nodeId` on the `Tag` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_nodeId_fkey";

-- DropIndex
DROP INDEX "Tag_nodeId_idx";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "nodeId";

-- CreateTable
CREATE TABLE "_NodeToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_NodeToTag_AB_unique" ON "_NodeToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_NodeToTag_B_index" ON "_NodeToTag"("B");

-- AddForeignKey
ALTER TABLE "_NodeToTag" ADD CONSTRAINT "_NodeToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NodeToTag" ADD CONSTRAINT "_NodeToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
