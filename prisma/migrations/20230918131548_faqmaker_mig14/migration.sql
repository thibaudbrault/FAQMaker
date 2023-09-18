-- CreateTable
CREATE TABLE "Integrations" (
    "id" TEXT NOT NULL,
    "slack" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Integrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Integrations_tenantId_key" ON "Integrations"("tenantId");

-- CreateIndex
CREATE INDEX "Integrations_tenantId_idx" ON "Integrations"("tenantId");

-- AddForeignKey
ALTER TABLE "Integrations" ADD CONSTRAINT "Integrations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
