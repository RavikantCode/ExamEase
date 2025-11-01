-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FACULTY', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'FACULTY';
