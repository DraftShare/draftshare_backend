/*
  Warnings:

  - The primary key for the `CardField` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_pkey",
ADD CONSTRAINT "CardField_pkey" PRIMARY KEY ("cardId", "authorId", "name");
