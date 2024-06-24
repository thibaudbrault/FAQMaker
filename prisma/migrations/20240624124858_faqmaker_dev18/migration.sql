/*
  Warnings:

  - A unique constraint covering the columns `[email,domain,logo,customerId]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Tenant_customerId_key";

-- DropIndex
DROP INDEX "Tenant_domain_key";

-- DropIndex
DROP INDEX "Tenant_email_key";

-- DropIndex
DROP INDEX "Tenant_logo_key";

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "nodeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reaction_userId_nodeId_idx" ON "Reaction"("userId", "nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_nodeId_key" ON "Reaction"("userId", "nodeId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_domain_logo_customerId_key" ON "Tenant"("email", "domain", "logo", "customerId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
