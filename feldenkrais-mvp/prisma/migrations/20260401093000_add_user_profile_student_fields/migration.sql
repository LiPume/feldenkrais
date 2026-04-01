-- AlterTable
ALTER TABLE "user_profiles"
ADD COLUMN "student_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_student_id_key" ON "user_profiles"("student_id");
