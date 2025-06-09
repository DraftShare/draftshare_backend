/*
  Warnings:

  - The primary key for the `CardField` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('INPUT', 'TEXTAREA', 'SELECT', 'MULTISELECT');

-- AlterTable
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_pkey",
ADD CONSTRAINT "CardField_pkey" PRIMARY KEY ("cardId", "fieldId", "value");

-- AlterTable
ALTER TABLE "Field" ADD COLUMN     "options" TEXT[],
ADD COLUMN     "type" "FieldType" NOT NULL DEFAULT 'INPUT';
