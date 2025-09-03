-- CreateTable
CREATE TABLE "_CaseToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CaseToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CaseToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CaseToUser_AB_unique" ON "_CaseToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CaseToUser_B_index" ON "_CaseToUser"("B");
