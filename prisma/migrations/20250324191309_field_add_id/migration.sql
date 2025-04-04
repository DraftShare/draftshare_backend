/*
  Warnings:

  - The primary key for the `CardField` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorId` on the `CardField` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CardField` table. All the data in the column will be lost.
  - The primary key for the `Field` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `fieldId` to the `CardField` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_authorId_name_fkey";

-- AlterTable
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_pkey",
DROP COLUMN "authorId",
DROP COLUMN "name",
ADD COLUMN     "fieldId" INTEGER NOT NULL,
ADD CONSTRAINT "CardField_pkey" PRIMARY KEY ("cardId", "fieldId");

-- AlterTable
ALTER TABLE "Field" DROP CONSTRAINT "Field_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Field_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "CardField" ADD CONSTRAINT "CardField_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;
