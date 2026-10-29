# Prompt 01 local foundation

This is an isolated skeleton. Legacy folders remain untouched. No product endpoint handles customer data yet. The API uses a separate origin and exposes only `/health` and `/ready`; Prompt 02 adds Firebase verification and organization authorization before any `/v1` route.

## Requirements

- Python 3.12, Node 20.19+ or 22.12+, Docker Engine in Ubuntu-24.04 WSL, and `uv`.
- For a full local Supabase Storage stack, install the Supabase CLI. Use only `supabase start` locally; do not link or push to a hosted project from this workflow.

## Local startup

1. Open Ubuntu-24.04 so systemd starts its Docker Engine. From the repository root, run `wsl -d Ubuntu-24.04 -- docker compose -f infra/compose.yaml up -d --wait` in PowerShell; the same relative `docker compose` command works in Ubuntu. The Compose file binds pgvector Postgres to `127.0.0.1:55432` and Redis to `127.0.0.1:56379`, away from ports already used by other projects. This Postgres instance proves the app schema without touching a remote project.
2. Run `uv sync --extra dev`. If uv cannot access its default cache on this Windows machine, use `uv sync --extra dev --python C:\Python312\python.exe --cache-dir .uv-cache`. Copy `apps/api/.env.example` to root `.env` and supply local values. `DATABASE_URL` must use the `postgresql+psycopg://` dialect and port 55432. `REDIS_URL` points to local port 56379. All listed server variables are required even though Firebase and Storage are not called in Prompt 01. Use synthetic local-only placeholders for those unused provider fields; never use production credentials locally.
3. Run `uv run alembic upgrade head` twice. `uv run alembic current` should show `0001_foundation` once. On Windows, the same commands can use `.venv\Scripts\alembic.exe` directly. For recovery rehearsal on disposable local data only: `alembic downgrade base`, then `alembic upgrade head`.
4. Run `uv run uvicorn apps.api.main:app --host 127.0.0.1 --port 8000`. `/health` is process liveness; `/ready` checks Postgres and Redis. Run `uv run celery -A apps.worker.celery_app:app worker --loglevel=INFO --pool=solo` in another terminal (solo pool is suitable for Windows development).
5. Run `cd apps/web`, `npm ci`, then `npm run dev`. The web app does not connect to the legacy server. Its `.env.example` lists browser-safe variable names only. The auth SDK is reserved for Prompt 02.

The API and worker read the root `.env` via Pydantic settings. For test, dev, and prod use separate secret stores and set `APP_ENV` accordingly. Prod must receive all server variables at startup; missing values fail validation. Never put `SUPABASE_SERVICE_ROLE_KEY`, `FIREBASE_CREDENTIALS`, payment, or model keys under a `VITE_` name. Do not expose either local service over a public interface.

## Supabase Storage locally

If private object storage needs to be exercised, start the local Supabase stack with `supabase start` (requires the WSL Docker Engine). The PSec CLI ports are 55420-55426. Use the local database URL reported by `supabase status` as `DATABASE_URL`, run Alembic, then apply `supabase/storage_setup.sql` to that local database with `psql`. It creates a non-public `psec-private` bucket and grants no browser policies. The CLI stack and Compose Postgres use different ports; select one database at a time. Storage ownership, signed URLs, and object policies are Prompt 03/07 work. Do not upload real files yet.

## Checks

Run `uv run ruff check apps tests`, `uv run mypy apps tests`, `uv run pytest`, and from `apps/web`: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`. Run `PSEC_SCHEMA_TEST=1 uv run pytest tests/test_schema.py` after migration on disposable Postgres (PowerShell: `$env:PSEC_SCHEMA_TEST='1'`). The decisive migration checks are `upgrade head` twice and `current` with one row. CI runs the executable gates and scans the web output for server-only variable names. A successful check does not authorize real data or public routing.

## Synthetic fixtures

Prompt 02 should use two invented organizations and users with distinct UUIDs and one membership per user. Store redacted fixture documents as tiny synthetic strings or generated files in test-only code, never real reports in git. Each tenant-owned child uses a trusted `org_id`; composite foreign keys reject parent IDs from another organization. Future tests must prove both database parent consistency and service-layer denial, because service-role connections bypass RLS. The initial migration enables RLS with no browser policies, but the API service checks are still pending Prompt 02.

## Migration ownership and rollback

Alembic owns the `public` application schema. `supabase/storage_setup.sql` owns only the local private bucket setup. Do not run Supabase CLI schema migrations against these tables. On disposable local data, `alembic downgrade base` removes all foundation tables. For any future populated environment, take a verified backup and use a forward fix instead of downgrading. No production schema or storage resource is created by this prompt.
