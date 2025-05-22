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
    "objectKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "noteId" TEXT NOT NULL,
    CONSTRAINT "NoteImage_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "altText" TEXT,
    "objectKey" TEXT NOT NULL,
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
CREATE TABLE "Passkey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "aaguid" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publicKey" BLOB NOT NULL,
    "userId" TEXT NOT NULL,
    "webauthnUserId" TEXT NOT NULL,
    "counter" BIGINT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "backedUp" BOOLEAN NOT NULL,
    "transports" TEXT,
    CONSTRAINT "Passkey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caseId" INTEGER NOT NULL,
    "rules_engine_version" TEXT NOT NULL,
    CONSTRAINT "Analysis_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HeatingInput" (
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
    "invertDefaultInclusion" BOOLEAN NOT NULL,
    CONSTRAINT "ProcessedEnergyBill_analysisInputId_fkey" FOREIGN KEY ("analysisInputId") REFERENCES "HeatingInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE TABLE "EnergyUsageFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provider" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "precedingDeliveryDate" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AnalysisDataFile" (
    "analysisId" INTEGER NOT NULL,
    "energyUsageFileId" INTEGER NOT NULL,
    CONSTRAINT "AnalysisDataFile_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AnalysisDataFile_energyUsageFileId_fkey" FOREIGN KEY ("energyUsageFileId") REFERENCES "EnergyUsageFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "firstName1" TEXT NOT NULL,
    "lastName1" TEXT NOT NULL,
    "email1" TEXT NOT NULL,
    "firstName2" TEXT NOT NULL,
    "lastName2" TEXT NOT NULL,
    "email2" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Location" (
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

-- CreateTable
CREATE TABLE "CaseUser" (
    "analysisId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CaseUser_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "HeatingInput" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CaseUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE INDEX "Passkey_userId_idx" ON "Passkey"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalysisDataFile_analysisId_energyUsageFileId_key" ON "AnalysisDataFile"("analysisId", "energyUsageFileId");

-- CreateIndex
CREATE UNIQUE INDEX "CaseUser_analysisId_userId_key" ON "CaseUser"("analysisId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

INSERT INTO Permission VALUES('clnf2zvli0000pcou3zzzzome','create','user','own','',1696625465526,1696625465526);
INSERT INTO Permission VALUES('clnf2zvll0001pcouly1310ku','create','user','any','',1696625465529,1696625465529);
INSERT INTO Permission VALUES('clnf2zvll0002pcouka7348re','read','user','own','',1696625465530,1696625465530);
INSERT INTO Permission VALUES('clnf2zvlm0003pcouea4dee51','read','user','any','',1696625465530,1696625465530);
INSERT INTO Permission VALUES('clnf2zvlm0004pcou2guvolx5','update','user','own','',1696625465531,1696625465531);
INSERT INTO Permission VALUES('clnf2zvln0005pcoun78ps5ap','update','user','any','',1696625465531,1696625465531);
INSERT INTO Permission VALUES('clnf2zvlo0006pcouyoptc5jp','delete','user','own','',1696625465532,1696625465532);
INSERT INTO Permission VALUES('clnf2zvlo0007pcouw1yzoyam','delete','user','any','',1696625465533,1696625465533);
INSERT INTO Permission VALUES('clnf2zvlp0008pcou9r0fhbm8','create','note','own','',1696625465533,1696625465533);
INSERT INTO Permission VALUES('clnf2zvlp0009pcouj3qib9q9','create','note','any','',1696625465534,1696625465534);
INSERT INTO Permission VALUES('clnf2zvlq000apcouxnspejs9','read','note','own','',1696625465535,1696625465535);
INSERT INTO Permission VALUES('clnf2zvlr000bpcouf4cg3x72','read','note','any','',1696625465535,1696625465535);
INSERT INTO Permission VALUES('clnf2zvlr000cpcouy1vp6oeg','update','note','own','',1696625465536,1696625465536);
INSERT INTO Permission VALUES('clnf2zvls000dpcouvzwjjzrq','update','note','any','',1696625465536,1696625465536);
INSERT INTO Permission VALUES('clnf2zvls000epcou4ts5ui8f','delete','note','own','',1696625465537,1696625465537);
INSERT INTO Permission VALUES('clnf2zvlt000fpcouk29jbmxn','delete','note','any','',1696625465538,1696625465538);

INSERT INTO Role VALUES('clnf2zvlw000gpcour6dyyuh6','admin','',1696625465540,1696625465540);
INSERT INTO Role VALUES('clnf2zvlx000hpcou5dfrbegs','user','',1696625465542,1696625465542);

INSERT INTO _PermissionToRole VALUES('clnf2zvll0001pcouly1310ku','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvlm0003pcouea4dee51','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvln0005pcoun78ps5ap','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvlo0007pcouw1yzoyam','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvlp0009pcouj3qib9q9','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvlr000bpcouf4cg3x72','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvls000dpcouvzwjjzrq','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvlt000fpcouk29jbmxn','clnf2zvlw000gpcour6dyyuh6');
INSERT INTO _PermissionToRole VALUES('clnf2zvli0000pcou3zzzzome','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvll0002pcouka7348re','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvlm0004pcou2guvolx5','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvlo0006pcouyoptc5jp','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvlp0008pcou9r0fhbm8','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvlq000apcouxnspejs9','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvlr000cpcouy1vp6oeg','clnf2zvlx000hpcou5dfrbegs');
INSERT INTO _PermissionToRole VALUES('clnf2zvls000epcou4ts5ui8f','clnf2zvlx000hpcou5dfrbegs');
