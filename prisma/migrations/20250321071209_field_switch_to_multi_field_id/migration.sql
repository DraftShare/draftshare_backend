/*
  Warnings:

  - Added the required column `authorId` to the `CardField` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_name_fkey";

-- DropIndex
DROP INDEX "Field_name_key";

-- AlterTable
ALTER TABLE "CardField" ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Field" ADD CONSTRAINT "Field_pkey" PRIMARY KEY ("authorId", "name");

-- AddForeignKey
ALTER TABLE "CardField" ADD CONSTRAINT "CardField_authorId_name_fkey" FOREIGN KEY ("authorId", "name") REFERENCES "Field"("authorId", "name") ON DELETE CASCADE ON UPDATE CASCADE;
