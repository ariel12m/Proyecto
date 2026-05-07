/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `cedula` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `licenseNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "cedula",
DROP COLUMN "licenseNumber",
DROP COLUMN "phone",
DROP COLUMN "vehicle",
ADD COLUMN     "birthDate" TEXT,
ADD COLUMN     "jobPosition" TEXT,
ADD COLUMN     "photo" TEXT;
