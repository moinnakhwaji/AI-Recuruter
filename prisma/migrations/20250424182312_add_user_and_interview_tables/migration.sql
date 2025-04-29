/*
  Warnings:

  - You are about to drop the column `pictures` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pictures",
ADD COLUMN     "imageUrl" TEXT;
