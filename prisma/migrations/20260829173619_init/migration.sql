-- CreateTable
CREATE TABLE "Resenha" (
    "id" SERIAL NOT NULL,
    "bookTitle" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "review" TEXT,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resenha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resenha_bookTitle_key" ON "Resenha"("bookTitle");
