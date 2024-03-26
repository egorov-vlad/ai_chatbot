-- CreateTable
CREATE TABLE "Teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "players" TEXT[],
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);
