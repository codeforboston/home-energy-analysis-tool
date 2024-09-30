/*
  Warnings:

  - A unique constraint covering the columns `[caseId,userId]` on the table `CaseUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CaseUser_caseId_userId_key" ON "CaseUser"("caseId", "userId");
