/*
  Warnings:

  - A unique constraint covering the columns `[shortcode,nodeId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reaction_nodeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_shortcode_nodeId_key" ON "Reaction"("shortcode", "nodeId");
