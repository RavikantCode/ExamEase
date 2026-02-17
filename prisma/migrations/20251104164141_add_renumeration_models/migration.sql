-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "Faculty" ADD COLUMN     "claimedAmount" INTEGER,
ADD COLUMN     "moodleId" TEXT,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
ADD COLUMN     "submittedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "verifiedAmount" INTEGER;
