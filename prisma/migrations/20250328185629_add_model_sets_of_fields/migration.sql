-- CreateTable
CREATE TABLE "SetsOfFields" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "SetsOfFields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FieldToSetsOfFields" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FieldToSetsOfFields_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FieldToSetsOfFields_B_index" ON "_FieldToSetsOfFields"("B");

-- AddForeignKey
ALTER TABLE "SetsOfFields" ADD CONSTRAINT "SetsOfFields_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToSetsOfFields" ADD CONSTRAINT "_FieldToSetsOfFields_A_fkey" FOREIGN KEY ("A") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToSetsOfFields" ADD CONSTRAINT "_FieldToSetsOfFields_B_fkey" FOREIGN KEY ("B") REFERENCES "SetsOfFields"("id") ON DELETE CASCADE ON UPDATE CASCADE;
