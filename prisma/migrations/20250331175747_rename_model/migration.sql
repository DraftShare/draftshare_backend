/*
  Warnings:

  - You are about to drop the `SetsOfFields` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FieldToSetsOfFields` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SetsOfFields" DROP CONSTRAINT "SetsOfFields_authorId_fkey";

-- DropForeignKey
ALTER TABLE "_FieldToSetsOfFields" DROP CONSTRAINT "_FieldToSetsOfFields_A_fkey";

-- DropForeignKey
ALTER TABLE "_FieldToSetsOfFields" DROP CONSTRAINT "_FieldToSetsOfFields_B_fkey";

-- DropTable
DROP TABLE "SetsOfFields";

-- DropTable
DROP TABLE "_FieldToSetsOfFields";

-- CreateTable
CREATE TABLE "SetOfFields" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "SetOfFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FieldToSetOfFields" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FieldToSetOfFields_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FieldToSetOfFields_B_index" ON "_FieldToSetOfFields"("B");

-- AddForeignKey
ALTER TABLE "SetOfFields" ADD CONSTRAINT "SetOfFields_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToSetOfFields" ADD CONSTRAINT "_FieldToSetOfFields_A_fkey" FOREIGN KEY ("A") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToSetOfFields" ADD CONSTRAINT "_FieldToSetOfFields_B_fkey" FOREIGN KEY ("B") REFERENCES "SetOfFields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
