/*
  Warnings:

  - A unique constraint covering the columns `[cardId,fieldId]` on the table `CardField` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "CardFieldValue" (
    "cardId" INTEGER NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "CardFieldValue_pkey" PRIMARY KEY ("cardId","fieldId","value")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardField_cardId_fieldId_key" ON "CardField"("cardId", "fieldId");

-- AddForeignKey
ALTER TABLE "CardFieldValue" ADD CONSTRAINT "CardFieldValue_cardId_fieldId_fkey" FOREIGN KEY ("cardId", "fieldId") REFERENCES "CardField"("cardId", "fieldId") ON DELETE RESTRICT ON UPDATE CASCADE;
