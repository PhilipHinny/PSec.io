-- Apply only to a local Supabase database after the Alembic migration.
INSERT INTO storage.buckets (id, name, public)
VALUES ('psec-private', 'psec-private', false)
ON CONFLICT (id) DO UPDATE SET public = false;
-- No browser policies are granted. API/worker service credentials are server-only.
