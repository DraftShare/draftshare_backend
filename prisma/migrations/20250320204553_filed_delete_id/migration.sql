/*
  Warnings:

  - The primary key for the `CardField` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fieldId` on the `CardField` table. All the data in the column will be lost.
  - The primary key for the `Field` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Field` table. All the data in the column will be lost.
  - Added the required column `fieldName` to the `CardField` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_fieldId_fkey";

-- AlterTable
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_pkey",
DROP COLUMN "fieldId",
ADD COLUMN     "fieldName" TEXT NOT NULL,
ADD CONSTRAINT "CardField_pkey" PRIMARY KEY ("cardId", "fieldName");

-- AlterTable
ALTER TABLE "Field" DROP CONSTRAINT "Field_pkey",
DROP COLUMN "id";

-- AddForeignKey
ALTER TABLE "CardField" ADD CONSTRAINT "CardField_fieldName_fkey" FOREIGN KEY ("fieldName") REFERENCES "Field"("name") ON DELETE CASCADE ON UPDATE CASCADE;
