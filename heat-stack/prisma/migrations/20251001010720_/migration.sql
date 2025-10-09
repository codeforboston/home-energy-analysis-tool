/*
  Warnings:

  - You are about to drop the `CaseUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[homeOwnerId,locationId]` on the table `Case` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CaseUser";
PRAGMA foreign_keys=on;

-- CreateIndex
CREATE UNIQUE INDEX "Case_homeOwnerId_locationId_key" ON "Case"("homeOwnerId", "locationId");
