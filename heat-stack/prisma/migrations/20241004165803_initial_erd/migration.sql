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
    "usageQuantity" REAL NOT NULL,
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
CREATE TABLE "Case" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "homeOwnerId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    CONSTRAINT "Case_homeOwnerId_fkey" FOREIGN KEY ("homeOwnerId") REFERENCES "HomeOwner" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Case_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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

-- CreateTable
CREATE TABLE "CaseUser" (
    "analysisInputId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CaseUser_analysisInputId_fkey" FOREIGN KEY ("analysisInputId") REFERENCES "AnalysisInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CaseUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisInput_summaryOutputId_key" ON "AnalysisInput"("summaryOutputId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisInputEnergyDataFile_analysisInputId_energyDataFileId_key" ON "AnalysisInputEnergyDataFile"("analysisInputId", "energyDataFileId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseUser_analysisInputId_userId_key" ON "CaseUser"("analysisInputId", "userId");
