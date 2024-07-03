-- CreateTable
CREATE TABLE "Home" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GasBill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "homeId" INTEGER NOT NULL,
    CONSTRAINT "GasBill_homeId_fkey" FOREIGN KEY ("homeId") REFERENCES "Home" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
