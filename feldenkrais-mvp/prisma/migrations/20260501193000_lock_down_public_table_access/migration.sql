-- Lock down direct Supabase REST access to business tables.
-- The Next.js app reads and writes these tables through server-side Prisma.
-- Browser Supabase clients are used for Auth only, so anon/authenticated
-- roles should not have direct table privileges in the public schema.

ALTER TABLE "user_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "body_regions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "practices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "practice_body_regions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feedback_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feedback_body_part_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feedback_labels" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "feedback_body_part_entry_labels" ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE "user_profiles" FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE "body_regions" FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE "practices" FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE "practice_body_regions" FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE "feedback_sessions" FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE "feedback_body_part_entries" FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE "feedback_labels" FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE "feedback_body_part_entry_labels" FROM anon, authenticated;

REVOKE ALL PRIVILEGES ON SCHEMA public FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
REVOKE ALL PRIVILEGES ON SEQUENCES FROM anon, authenticated;
