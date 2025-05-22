/*
  Warnings:

  - You are about to drop the `AnalysisInput` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnalysisInputEnergyDataFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnalysisOutput` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `CaseUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `analysisInputId` on the `CaseUser` table. All the data in the column will be lost.
  - Added the required column `analysisId` to the `CaseUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AnalysisInput_summaryOutputId_key";

-- DropIndex
DROP INDEX "AnalysisInputEnergyDataFile_analysisInputId_energyDataFileId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AnalysisInput";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AnalysisInputEnergyDataFile";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AnalysisOutput";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Note_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NoteImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "contentType" TEXT NOT NULL,
    "blob" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "noteId" TEXT NOT NULL,
    CONSTRAINT "NoteImage_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "contentType" TEXT NOT NULL,
    "blob" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "UserImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expirationDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "access" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "digits" INTEGER NOT NULL,
    "period" INTEGER NOT NULL,
    "charSet" TEXT NOT NULL,
    "expiresAt" DATETIME
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerName" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caseId" INTEGER NOT NULL,
    CONSTRAINT "Analysis_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HeatingInput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fuelType" TEXT NOT NULL,
    "designTemperatureOverride" BOOLEAN NOT NULL,
    "heatingSystemEfficiency" INTEGER NOT NULL,
    "thermostatSetPoint" INTEGER NOT NULL,
    "setbackTemperature" INTEGER NOT NULL,
    "setbackHoursPerDay" INTEGER NOT NULL,
    "numberOfOccupants" INTEGER NOT NULL,
    "estimatedWaterHeatingEfficiency" INTEGER NOT NULL,
    "standByLosses" INTEGER NOT NULL,
    "livingArea" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "HeatingOutput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analysisId" INTEGER NOT NULL,
    "estimatedBalancePoint" REAL NOT NULL,
    "otherFuelUsage" REAL NOT NULL,
    "averageIndoorTemperature" REAL NOT NULL,
    "differenceBetweenTiAndTbp" REAL NOT NULL,
    "designTemperature" REAL NOT NULL,
    "wholeHomeHeatLossRate" REAL NOT NULL,
    "standardDeviationOfHeatLossRate" REAL NOT NULL,
    "averageHeatLoad" REAL NOT NULL,
    "maximumHeatLoad" REAL NOT NULL,
    CONSTRAINT "HeatingOutput_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalysisDataFile" (
    "analysisId" INTEGER NOT NULL,
    "energyDataFileId" INTEGER NOT NULL,
    CONSTRAINT "AnalysisDataFile_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AnalysisDataFile_energyDataFileId_fkey" FOREIGN KEY ("energyDataFileId") REFERENCES "EnergyDataFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CaseUser" (
    "analysisId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CaseUser_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "HeatingInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CaseUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CaseUser" ("userId") SELECT "userId" FROM "CaseUser";
DROP TABLE "CaseUser";
ALTER TABLE "new_CaseUser" RENAME TO "CaseUser";
CREATE UNIQUE INDEX "CaseUser_analysisId_userId_key" ON "CaseUser"("analysisId", "userId");
CREATE TABLE "new_ProcessedEnergyBill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analysisInputId" INTEGER NOT NULL,
    "periodStartDate" DATETIME NOT NULL,
    "periodEndDate" DATETIME NOT NULL,
    "usageTherms" REAL NOT NULL,
    "wholeHomeHeatLossRate" REAL NOT NULL,
    "analysisType" INTEGER NOT NULL,
    "defaultInclusion" BOOLEAN NOT NULL,
    "inclusionOverride" BOOLEAN NOT NULL,
    CONSTRAINT "ProcessedEnergyBill_analysisInputId_fkey" FOREIGN KEY ("analysisInputId") REFERENCES "HeatingInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProcessedEnergyBill" ("analysisInputId", "analysisType", "defaultInclusion", "id", "inclusionOverride", "periodEndDate", "periodStartDate", "usageTherms", "wholeHomeHeatLossRate") SELECT "analysisInputId", "analysisType", "defaultInclusion", "id", "inclusionOverride", "periodEndDate", "periodStartDate", "usageTherms", "wholeHomeHeatLossRate" FROM "ProcessedEnergyBill";
DROP TABLE "ProcessedEnergyBill";
ALTER TABLE "new_ProcessedEnergyBill" RENAME TO "ProcessedEnergyBill";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Note_ownerId_idx" ON "Note"("ownerId");

-- CreateIndex
CREATE INDEX "Note_ownerId_updatedAt_idx" ON "Note"("ownerId", "updatedAt");

-- CreateIndex
CREATE INDEX "NoteImage_noteId_idx" ON "NoteImage"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "UserImage_userId_key" ON "UserImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_entity_access_key" ON "Permission"("action", "entity", "access");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_target_type_key" ON "Verification"("target", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_providerName_providerId_key" ON "Connection"("providerName", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisDataFile_analysisId_energyDataFileId_key" ON "AnalysisDataFile"("analysisId", "energyDataFileId");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");
