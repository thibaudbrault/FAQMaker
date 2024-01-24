/*
  Warnings:

  - You are about to drop the column `primary` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `secondary` on the `Color` table. All the data in the column will be lost.
  - Added the required column `background` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foreground` to the `Color` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Color" DROP COLUMN "primary",
DROP COLUMN "secondary",
ADD COLUMN     "background" TEXT NOT NULL,
ADD COLUMN     "foreground" TEXT NOT NULL;
