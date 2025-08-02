-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "moodle_id" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_moodle_id_key" ON "public"."User"("moodle_id");
