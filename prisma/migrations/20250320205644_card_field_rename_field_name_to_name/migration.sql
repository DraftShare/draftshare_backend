/*
  Warnings:

  - The primary key for the `CardField` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fieldName` on the `CardField` table. All the data in the column will be lost.
  - Added the required column `name` to the `CardField` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_fieldName_fkey";

-- AlterTable
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_pkey",
DROP COLUMN "fieldName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "CardField_pkey" PRIMARY KEY ("cardId", "name");

-- AddForeignKey
ALTER TABLE "CardField" ADD CONSTRAINT "CardField_name_fkey" FOREIGN KEY ("name") REFERENCES "Field"("name") ON DELETE CASCADE ON UPDATE CASCADE;
