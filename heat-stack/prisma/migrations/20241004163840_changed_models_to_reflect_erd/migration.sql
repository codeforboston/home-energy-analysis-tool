/*
  Warnings:

  - You are about to drop the `BillingPeriod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Home` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SummaryOutput` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `designTemperatureOverride` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedWaterHeatingEfficiency` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `fuelType` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `heatingSystemEfficiency` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `homeId` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfOccupants` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `setbackHoursPerDay` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `setbackTemperature` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `standByLosses` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `summaryOutputId` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `thermostatSetPoint` on the `Case` table. All the data in the column will be lost.
  - The primary key for the `CaseUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `caseId` on the `CaseUser` table. All the data in the column will be lost.
  - Added the required column `homeOwnerId` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationId` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `analysisInputId` to the `CaseUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SummaryOutput_caseId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BillingPeriod";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "File";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Home";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SummaryOutput";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AnalysisInput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caseId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "summaryOutputId" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "designTemperatureOverride" BOOLEAN NOT NULL,
    "heatingSystemEfficiency" INTEGER NOT NULL,
    "thermostatSetPoint" INTEGER NOT NULL,
    "setbackTemperature" INTEGER NOT NULL,
    "setbackHoursPerDay" INTEGER NOT NULL,
    "numberOfOccupants" INTEGER NOT NULL,
    "estimatedWaterHeatingEfficiency" INTEGER NOT NULL,
    "standByLosses" INTEGER NOT NULL,
    "livingArea" REAL NOT NULL,
    CONSTRAINT "AnalysisInput_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AnalysisInput_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcessedEnergyBill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analysisInputId" INTEGER NOT NULL,
    "periodStartDate" DATETIME NOT NULL,
    "periodEndDate" DATETIME NOT NULL,
    "usageTherms" REAL NOT NULL,
    "wholeHomeHeatLossRate" REAL NOT NULL,
    "analysisType" INTEGER NOT NULL,
    "defaultInclusion" BOOLEAN NOT NULL,
    "inclusionOverride" BOOLEAN NOT NULL,
    CONSTRAINT "ProcessedEnergyBill_analysisInputId_fkey" FOREIGN KEY ("analysisInputId") REFERENCES "AnalysisInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalysisOutput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analysisInputId" INTEGER NOT NULL,
    "estimatedBalancePoint" REAL NOT NULL,
    "otherFuelUsage" REAL NOT NULL,
    "averageIndoorTemperature" REAL NOT NULL,
    "differenceBetweenTiAndTbp" REAL NOT NULL,
    "designTemperature" REAL NOT NULL,
    "wholeHomeHeatLossRate" REAL NOT NULL,
    "standardDeviationOfHeatLossRate" REAL NOT NULL,
    "averageHeatLoad" REAL NOT NULL,
    "maximumHeatLoad" REAL NOT NULL,
    CONSTRAINT "AnalysisOutput_analysisInputId_fkey" FOREIGN KEY ("analysisInputId") REFERENCES "AnalysisInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EnergyDataFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provider" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "precedingDeliveryDate" DATETIME NOT NULL,
    "filePath" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AnalysisInputEnergyDataFile" (
    "analysisInputId" INTEGER NOT NULL,
    "energyDataFileId" INTEGER NOT NULL,
    CONSTRAINT "AnalysisInputEnergyDataFile_analysisInputId_fkey" FOREIGN KEY ("analysisInputId") REFERENCES "AnalysisInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AnalysisInputEnergyDataFile_energyDataFileId_fkey" FOREIGN KEY ("energyDataFileId") REFERENCES "EnergyDataFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HomeOwner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "contact_1_name" TEXT NOT NULL,
    "contact_1_email_address" TEXT NOT NULL,
    "contact_1_phone" TEXT NOT NULL,
    "contact_2_name" TEXT NOT NULL,
    "contact_2_email_address" TEXT NOT NULL,
    "contact_2_phone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contact_2_email_address" TEXT NOT NULL,
    "contact_2_phone" TEXT NOT NULL,
    "address" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Case" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "homeOwnerId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    CONSTRAINT "Case_homeOwnerId_fkey" FOREIGN KEY ("homeOwnerId") REFERENCES "HomeOwner" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Case_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Case" ("id") SELECT "id" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
CREATE TABLE "new_CaseUser" (
    "analysisInputId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CaseUser_analysisInputId_fkey" FOREIGN KEY ("analysisInputId") REFERENCES "AnalysisInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CaseUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CaseUser" ("userId") SELECT "userId" FROM "CaseUser";
DROP TABLE "CaseUser";
ALTER TABLE "new_CaseUser" RENAME TO "CaseUser";
CREATE UNIQUE INDEX "CaseUser_analysisInputId_userId_key" ON "CaseUser"("analysisInputId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisInput_summaryOutputId_key" ON "AnalysisInput"("summaryOutputId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisInputEnergyDataFile_analysisInputId_energyDataFileId_key" ON "AnalysisInputEnergyDataFile"("analysisInputId", "energyDataFileId");
