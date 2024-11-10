-- DropIndex
DROP INDEX "Answer_nodeId_idx";

-- DropIndex
DROP INDEX "Answer_userId_idx";

-- DropIndex
DROP INDEX "Question_nodeId_idx";

-- DropIndex
DROP INDEX "Question_userId_idx";

-- CreateIndex
CREATE INDEX "Answer_nodeId_userId_idx" ON "Answer"("nodeId", "userId");

-- CreateIndex
CREATE INDEX "Favorite_userId_nodeId_idx" ON "Favorite"("userId", "nodeId");

-- CreateIndex
CREATE INDEX "Question_nodeId_userId_idx" ON "Question"("nodeId", "userId");
