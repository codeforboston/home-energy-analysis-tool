/*
  Warnings:

  - You are about to drop the column `usageTherms` on the `ProcessedEnergyBill` table. All the data in the column will be lost.
  - Added the required column `usageQuantity` to the `ProcessedEnergyBill` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProcessedEnergyBill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analysisInputId" INTEGER NOT NULL,
    "periodStartDate" DATETIME NOT NULL,
    "periodEndDate" DATETIME NOT NULL,
    "usageQuantity" REAL NOT NULL,
    "wholeHomeHeatLossRate" REAL NOT NULL,
    "analysisType" INTEGER NOT NULL,
    "defaultInclusion" BOOLEAN NOT NULL,
    "invertDefaultInclusion" BOOLEAN NOT NULL,
    CONSTRAINT "ProcessedEnergyBill_analysisInputId_fkey" FOREIGN KEY ("analysisInputId") REFERENCES "HeatingInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProcessedEnergyBill" ("analysisInputId", "analysisType", "defaultInclusion", "id", "invertDefaultInclusion", "periodEndDate", "periodStartDate", "wholeHomeHeatLossRate") SELECT "analysisInputId", "analysisType", "defaultInclusion", "id", "invertDefaultInclusion", "periodEndDate", "periodStartDate", "wholeHomeHeatLossRate" FROM "ProcessedEnergyBill";
DROP TABLE "ProcessedEnergyBill";
ALTER TABLE "new_ProcessedEnergyBill" RENAME TO "ProcessedEnergyBill";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
