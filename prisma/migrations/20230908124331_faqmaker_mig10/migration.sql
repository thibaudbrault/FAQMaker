/*
  Warnings:

  - You are about to drop the column `bg` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Color` table. All the data in the column will be lost.
  - Added the required column `primary` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondary` to the `Color` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Color" DROP COLUMN "bg",
DROP COLUMN "text",
ADD COLUMN     "primary" TEXT NOT NULL,
ADD COLUMN     "secondary" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT;
