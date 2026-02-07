-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HeatingInput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analysisId" INTEGER NOT NULL,
    "fuelType" TEXT NOT NULL,
    "designTemperatureOverride" BOOLEAN NOT NULL,
    "heatingSystemEfficiency" INTEGER NOT NULL,
    "thermostatSetPoint" INTEGER NOT NULL,
    "setbackTemperature" INTEGER,
    "setbackHoursPerDay" INTEGER,
    "numberOfOccupants" INTEGER NOT NULL,
    "estimatedWaterHeatingEfficiency" INTEGER NOT NULL,
    "standByLosses" INTEGER NOT NULL,
    "livingArea" REAL NOT NULL,
    CONSTRAINT "HeatingInput_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HeatingInput" ("id", "analysisId", "fuelType", "designTemperatureOverride", "heatingSystemEfficiency", "thermostatSetPoint", "setbackTemperature", "setbackHoursPerDay", "numberOfOccupants", "estimatedWaterHeatingEfficiency", "standByLosses", "livingArea") SELECT "id", "analysisId", "fuelType", "designTemperatureOverride", "heatingSystemEfficiency", "thermostatSetPoint", "setbackTemperature", "setbackHoursPerDay", "numberOfOccupants", "estimatedWaterHeatingEfficiency", "standByLosses", "livingArea" FROM "HeatingInput";
DROP TABLE "HeatingInput";
ALTER TABLE "new_HeatingInput" RENAME TO "HeatingInput";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
