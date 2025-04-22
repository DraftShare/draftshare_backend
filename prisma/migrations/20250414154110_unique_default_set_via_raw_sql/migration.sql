-- DropIndex
DROP INDEX "SetOfFields_defaultSet_authorId_key";

CREATE UNIQUE INDEX only_one_default_per_author 
ON "SetOfFields" ("authorId") 
WHERE "defaultSet" = true;
