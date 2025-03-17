-- DropForeignKey
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_cardId_fkey";

-- DropForeignKey
ALTER TABLE "CardField" DROP CONSTRAINT "CardField_fieldId_fkey";

-- AddForeignKey
ALTER TABLE "CardField" ADD CONSTRAINT "CardField_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardField" ADD CONSTRAINT "CardField_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;
