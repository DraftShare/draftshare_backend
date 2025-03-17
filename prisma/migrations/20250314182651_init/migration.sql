-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "tgId" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardField" (
    "cardId" INTEGER NOT NULL,
    "fieldId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "CardField_pkey" PRIMARY KEY ("cardId","fieldId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_tgId_key" ON "User"("tgId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardField" ADD CONSTRAINT "CardField_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardField" ADD CONSTRAINT "CardField_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
