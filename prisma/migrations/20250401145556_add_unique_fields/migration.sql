/*
  Warnings:

  - A unique constraint covering the columns `[name,authorId]` on the table `Field` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,authorId]` on the table `SetOfFields` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Field_name_authorId_key" ON "Field"("name", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "SetOfFields_name_authorId_key" ON "SetOfFields"("name", "authorId");
