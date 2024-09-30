/*
  Warnings:

  - A unique constraint covering the columns `[caseId]` on the table `SummaryOutput` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contact_1_email_address` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_1_name` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_1_phone` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_2_email_address` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_2_name` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_2_phone` to the `Home` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Home" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contact_1_name" TEXT NOT NULL,
    "contact_1_email_address" TEXT NOT NULL,
    "contact_1_phone" TEXT NOT NULL,
    "contact_2_name" TEXT NOT NULL,
    "contact_2_email_address" TEXT NOT NULL,
    "contact_2_phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "livingArea" REAL NOT NULL
);
INSERT INTO "new_Home" ("address", "id", "livingArea", "name") SELECT "address", "id", "livingArea", "name" FROM "Home";
DROP TABLE "Home";
ALTER TABLE "new_Home" RENAME TO "Home";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SummaryOutput_caseId_key" ON "SummaryOutput"("caseId");
