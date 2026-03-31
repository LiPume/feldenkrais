-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('student', 'teacher');

-- CreateEnum
CREATE TYPE "BodyViewSide" AS ENUM ('front', 'back');

-- CreateEnum
CREATE TYPE "PracticeStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "FeedbackPhase" AS ENUM ('before', 'after');

-- CreateEnum
CREATE TYPE "LeftRightDiff" AS ENUM ('none', 'left_more', 'right_more', 'unclear');

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'student',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_regions" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name_zh" TEXT NOT NULL,
    "view_side" "BodyViewSide" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "svg_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "body_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practices" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "course_name" TEXT,
    "summary" TEXT,
    "content_text" TEXT,
    "audio_url" TEXT,
    "duration_sec" INTEGER,
    "status" "PracticeStatus" NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_body_regions" (
    "id" UUID NOT NULL,
    "practice_id" UUID NOT NULL,
    "body_region_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practice_body_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_sessions" (
    "id" UUID NOT NULL,
    "student_profile_id" UUID NOT NULL,
    "practice_id" UUID,
    "practice_title_snapshot" TEXT,
    "feedback_phase" "FeedbackPhase" NOT NULL,
    "feedback_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_body_part_entries" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "body_region_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "intensity_score" INTEGER NOT NULL,
    "left_right_diff" "LeftRightDiff",
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_body_part_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_labels" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name_zh" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_body_part_entry_labels" (
    "id" UUID NOT NULL,
    "entry_id" UUID NOT NULL,
    "label_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_body_part_entry_labels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");

-- CreateIndex
CREATE INDEX "user_profiles_role_idx" ON "user_profiles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "body_regions_code_key" ON "body_regions"("code");

-- CreateIndex
CREATE INDEX "body_regions_view_side_sort_order_idx" ON "body_regions"("view_side", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "practices_slug_key" ON "practices"("slug");

-- CreateIndex
CREATE INDEX "practices_status_updated_at_idx" ON "practices"("status", "updated_at");

-- CreateIndex
CREATE INDEX "practice_body_regions_body_region_id_practice_id_idx" ON "practice_body_regions"("body_region_id", "practice_id");

-- CreateIndex
CREATE UNIQUE INDEX "practice_body_regions_practice_id_body_region_id_key" ON "practice_body_regions"("practice_id", "body_region_id");

-- CreateIndex
CREATE INDEX "feedback_sessions_student_profile_id_feedback_date_idx" ON "feedback_sessions"("student_profile_id", "feedback_date");

-- CreateIndex
CREATE INDEX "feedback_sessions_practice_id_feedback_date_idx" ON "feedback_sessions"("practice_id", "feedback_date");

-- CreateIndex
CREATE INDEX "feedback_sessions_feedback_phase_feedback_date_idx" ON "feedback_sessions"("feedback_phase", "feedback_date");

-- CreateIndex
CREATE INDEX "feedback_body_part_entries_session_id_sort_order_idx" ON "feedback_body_part_entries"("session_id", "sort_order");

-- CreateIndex
CREATE INDEX "feedback_body_part_entries_body_region_id_created_at_idx" ON "feedback_body_part_entries"("body_region_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_body_part_entries_session_id_body_region_id_key" ON "feedback_body_part_entries"("session_id", "body_region_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_labels_code_key" ON "feedback_labels"("code");

-- CreateIndex
CREATE INDEX "feedback_labels_is_active_sort_order_idx" ON "feedback_labels"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "feedback_body_part_entry_labels_label_id_entry_id_idx" ON "feedback_body_part_entry_labels"("label_id", "entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_body_part_entry_labels_entry_id_label_id_key" ON "feedback_body_part_entry_labels"("entry_id", "label_id");

-- AddForeignKey
ALTER TABLE "practice_body_regions" ADD CONSTRAINT "practice_body_regions_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_body_regions" ADD CONSTRAINT "practice_body_regions_body_region_id_fkey" FOREIGN KEY ("body_region_id") REFERENCES "body_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_sessions" ADD CONSTRAINT "feedback_sessions_student_profile_id_fkey" FOREIGN KEY ("student_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_sessions" ADD CONSTRAINT "feedback_sessions_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_body_part_entries" ADD CONSTRAINT "feedback_body_part_entries_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "feedback_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_body_part_entries" ADD CONSTRAINT "feedback_body_part_entries_body_region_id_fkey" FOREIGN KEY ("body_region_id") REFERENCES "body_regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_body_part_entry_labels" ADD CONSTRAINT "feedback_body_part_entry_labels_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "feedback_body_part_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_body_part_entry_labels" ADD CONSTRAINT "feedback_body_part_entry_labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "feedback_labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
