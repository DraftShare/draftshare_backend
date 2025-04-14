/*
  Warnings:

  - A unique constraint covering the columns `[defaultSet,authorId]` on the table `SetOfFields` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SetOfFields" ADD COLUMN     "defaultSet" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "SetOfFields_defaultSet_authorId_key" ON "SetOfFields"("defaultSet", "authorId");
