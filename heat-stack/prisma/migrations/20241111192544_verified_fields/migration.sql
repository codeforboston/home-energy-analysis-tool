/*
  Warnings:

  - You are about to drop the `EnergyDataFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `energyDataFileId` on the `AnalysisDataFile` table. All the data in the column will be lost.
  - You are about to drop the column `contact_1_email_address` on the `HomeOwner` table. All the data in the column will be lost.
  - You are about to drop the column `contact_1_name` on the `HomeOwner` table. All the data in the column will be lost.
  - You are about to drop the column `contact_1_phone` on the `HomeOwner` table. All the data in the column will be lost.
  - You are about to drop the column `contact_2_email_address` on the `HomeOwner` table. All the data in the column will be lost.
  - You are about to drop the column `contact_2_name` on the `HomeOwner` table. All the data in the column will be lost.
  - You are about to drop the column `contact_2_phone` on the `HomeOwner` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `HomeOwner` table. All the data in the column will be lost.
  - You are about to drop the column `contact_2_email_address` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `contact_2_phone` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `inclusionOverride` on the `ProcessedEnergyBill` table. All the data in the column will be lost.
  - Added the required column `rules_engine_version` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energyUsageFileId` to the `AnalysisDataFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `analysisId` to the `HeatingInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email1` to the `HomeOwner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email2` to the `HomeOwner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName1` to the `HomeOwner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName2` to the `HomeOwner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName1` to the `HomeOwner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName2` to the `HomeOwner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `livingAreaSquareFeet` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipcode` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invertDefaultInclusion` to the `ProcessedEnergyBill` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EnergyDataFile";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "EnergyUsageFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provider" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "precedingDeliveryDate" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analysis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caseId" INTEGER NOT NULL,
    "rules_engine_version" TEXT NOT NULL,
    CONSTRAINT "Analysis_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Analysis" ("caseId", "id") SELECT "caseId", "id" FROM "Analysis";
DROP TABLE "Analysis";
ALTER TABLE "new_Analysis" RENAME TO "Analysis";
CREATE TABLE "new_AnalysisDataFile" (
    "analysisId" INTEGER NOT NULL,
    "energyUsageFileId" INTEGER NOT NULL,
    CONSTRAINT "AnalysisDataFile_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AnalysisDataFile_energyUsageFileId_fkey" FOREIGN KEY ("energyUsageFileId") REFERENCES "EnergyUsageFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AnalysisDataFile" ("analysisId") SELECT "analysisId" FROM "AnalysisDataFile";
DROP TABLE "AnalysisDataFile";
ALTER TABLE "new_AnalysisDataFile" RENAME TO "AnalysisDataFile";
CREATE UNIQUE INDEX "AnalysisDataFile_analysisId_energyUsageFileId_key" ON "AnalysisDataFile"("analysisId", "energyUsageFileId");
CREATE TABLE "new_HeatingInput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analysisId" INTEGER NOT NULL,
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
    CONSTRAINT "HeatingInput_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HeatingInput" ("designTemperatureOverride", "estimatedWaterHeatingEfficiency", "fuelType", "heatingSystemEfficiency", "id", "livingArea", "numberOfOccupants", "setbackHoursPerDay", "setbackTemperature", "standByLosses", "thermostatSetPoint") SELECT "designTemperatureOverride", "estimatedWaterHeatingEfficiency", "fuelType", "heatingSystemEfficiency", "id", "livingArea", "numberOfOccupants", "setbackHoursPerDay", "setbackTemperature", "standByLosses", "thermostatSetPoint" FROM "HeatingInput";
DROP TABLE "HeatingInput";
ALTER TABLE "new_HeatingInput" RENAME TO "HeatingInput";
CREATE TABLE "new_HomeOwner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName1" TEXT NOT NULL,
    "lastName1" TEXT NOT NULL,
    "email1" TEXT NOT NULL,
    "firstName2" TEXT NOT NULL,
    "lastName2" TEXT NOT NULL,
    "email2" TEXT NOT NULL
);
INSERT INTO "new_HomeOwner" ("id") SELECT "id" FROM "HomeOwner";
DROP TABLE "HomeOwner";
ALTER TABLE "new_HomeOwner" RENAME TO "HomeOwner";
CREATE TABLE "new_Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "livingAreaSquareFeet" INTEGER NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);
INSERT INTO "new_Location" ("address", "id") SELECT "address", "id" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
CREATE TABLE "new_ProcessedEnergyBill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analysisInputId" INTEGER NOT NULL,
    "periodStartDate" DATETIME NOT NULL,
    "periodEndDate" DATETIME NOT NULL,
    "usageTherms" REAL NOT NULL,
    "wholeHomeHeatLossRate" REAL NOT NULL,
    "analysisType" INTEGER NOT NULL,
    "defaultInclusion" BOOLEAN NOT NULL,
    "invertDefaultInclusion" BOOLEAN NOT NULL,
    CONSTRAINT "ProcessedEnergyBill_analysisInputId_fkey" FOREIGN KEY ("analysisInputId") REFERENCES "HeatingInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProcessedEnergyBill" ("analysisInputId", "analysisType", "defaultInclusion", "id", "periodEndDate", "periodStartDate", "usageTherms", "wholeHomeHeatLossRate") SELECT "analysisInputId", "analysisType", "defaultInclusion", "id", "periodEndDate", "periodStartDate", "usageTherms", "wholeHomeHeatLossRate" FROM "ProcessedEnergyBill";
DROP TABLE "ProcessedEnergyBill";
ALTER TABLE "new_ProcessedEnergyBill" RENAME TO "ProcessedEnergyBill";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
