-- CreateTable
CREATE TABLE "Resenha" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookTitle" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "review" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Resenha_bookTitle_key" ON "Resenha"("bookTitle");
