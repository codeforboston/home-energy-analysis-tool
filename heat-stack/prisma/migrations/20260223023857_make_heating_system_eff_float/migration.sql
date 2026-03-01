/*
  Warnings:

  - You are about to alter the column `heatingSystemEfficiency` on the `HeatingInput` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HeatingInput" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "analysisId" INTEGER NOT NULL,
    "fuelType" TEXT NOT NULL,
    "designTemperatureOverride" BOOLEAN NOT NULL,
    "heatingSystemEfficiency" REAL NOT NULL,
    "thermostatSetPoint" INTEGER NOT NULL,
    "setbackTemperature" INTEGER NOT NULL,
    "setbackHoursPerDay" INTEGER NOT NULL,
    "numberOfOccupants" INTEGER NOT NULL,
    "estimatedWaterHeatingEfficiency" INTEGER NOT NULL,
    "standByLosses" INTEGER NOT NULL,
    "livingArea" REAL NOT NULL,
    CONSTRAINT "HeatingInput_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HeatingInput" ("analysisId", "designTemperatureOverride", "estimatedWaterHeatingEfficiency", "fuelType", "heatingSystemEfficiency", "id", "livingArea", "numberOfOccupants", "setbackHoursPerDay", "setbackTemperature", "standByLosses", "thermostatSetPoint") SELECT "analysisId", "designTemperatureOverride", "estimatedWaterHeatingEfficiency", "fuelType", "heatingSystemEfficiency", "id", "livingArea", "numberOfOccupants", "setbackHoursPerDay", "setbackTemperature", "standByLosses", "thermostatSetPoint" FROM "HeatingInput";
DROP TABLE "HeatingInput";
ALTER TABLE "new_HeatingInput" RENAME TO "HeatingInput";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
