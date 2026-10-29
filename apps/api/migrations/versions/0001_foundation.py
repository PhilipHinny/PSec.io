"""Tenant-owned foundation schema.

Revision ID: 0001_foundation
Revises:
"""

from alembic import op

revision = "0001_foundation"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    op.execute("""
        CREATE TABLE organizations (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name text NOT NULL CHECK (length(trim(name)) > 0),
            created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE users (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            firebase_uid text NOT NULL UNIQUE CHECK (length(firebase_uid) > 0),
            created_at timestamptz NOT NULL DEFAULT now()
        );
        CREATE TABLE memberships (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            user_id uuid NOT NULL UNIQUE REFERENCES users(id),
            role text NOT NULL CHECK (role IN ('owner','admin','manager','contributor','viewer')),
            active boolean NOT NULL DEFAULT true,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id), UNIQUE (org_id, user_id)
        );
        CREATE INDEX memberships_org_active_idx ON memberships(org_id, active);
        CREATE TABLE projects (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            name text NOT NULL CHECK (length(trim(name)) > 0),
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id), UNIQUE (org_id, name)
        );
        CREATE TABLE documents (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            project_id uuid,
            object_key text NOT NULL,
            sha256 char(64) NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
            kind text NOT NULL CHECK (kind IN ('template','example','reference')),
            state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','quarantined','ready','failed')),
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id), UNIQUE (org_id, object_key),
            FOREIGN KEY (org_id, project_id) REFERENCES projects(org_id, id),
            CHECK (left(object_key, length(org_id::text) + 1) = org_id::text || '/')
        );
        CREATE INDEX documents_org_project_idx ON documents(org_id, project_id);
        CREATE TABLE document_chunks (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            document_id uuid NOT NULL,
            chunk_index integer NOT NULL CHECK (chunk_index >= 0),
            content text NOT NULL,
            embedding vector(1536),
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id), UNIQUE (org_id, document_id, chunk_index),
            FOREIGN KEY (org_id, document_id) REFERENCES documents(org_id, id)
        );
        CREATE INDEX document_chunks_org_document_idx ON document_chunks(org_id, document_id);
        CREATE INDEX document_chunks_embedding_idx ON document_chunks USING hnsw (embedding vector_cosine_ops);
        CREATE TABLE templates (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            name text NOT NULL,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id)
        );
        CREATE TABLE template_versions (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            template_id uuid NOT NULL,
            version integer NOT NULL CHECK (version > 0),
            schema_json jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id), UNIQUE (org_id, template_id, version),
            FOREIGN KEY (org_id, template_id) REFERENCES templates(org_id, id)
        );
        CREATE TABLE report_standards (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            name text NOT NULL,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id)
        );
        CREATE TABLE standard_versions (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            standard_id uuid NOT NULL,
            version integer NOT NULL CHECK (version > 0),
            rules_json jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id), UNIQUE (org_id, standard_id, version),
            FOREIGN KEY (org_id, standard_id) REFERENCES report_standards(org_id, id)
        );
        CREATE TABLE activities (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            project_id uuid NOT NULL,
            activity_date date NOT NULL,
            summary text NOT NULL,
            source_document_id uuid,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id),
            FOREIGN KEY (org_id, project_id) REFERENCES projects(org_id, id),
            FOREIGN KEY (org_id, source_document_id) REFERENCES documents(org_id, id)
        );
        CREATE INDEX activities_org_period_idx ON activities(org_id, project_id, activity_date);
        CREATE TABLE indicators (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            project_id uuid NOT NULL,
            label text NOT NULL,
            period_start date NOT NULL,
            period_end date NOT NULL,
            target numeric,
            achieved numeric,
            source_document_id uuid,
            verified boolean NOT NULL DEFAULT false,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id),
            CHECK (period_end >= period_start),
            FOREIGN KEY (org_id, project_id) REFERENCES projects(org_id, id),
            FOREIGN KEY (org_id, source_document_id) REFERENCES documents(org_id, id)
        );
        CREATE INDEX indicators_org_period_idx ON indicators(org_id, project_id, period_start, period_end);
        CREATE TABLE reports (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            project_id uuid NOT NULL,
            template_version_id uuid NOT NULL,
            standard_version_id uuid NOT NULL,
            period_start date NOT NULL,
            period_end date NOT NULL,
            state text NOT NULL DEFAULT 'queued' CHECK (state IN ('queued','generating','draft','in_review','changes_requested','approved','failed')),
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id),
            CHECK (period_end >= period_start),
            FOREIGN KEY (org_id, project_id) REFERENCES projects(org_id, id),
            FOREIGN KEY (org_id, template_version_id) REFERENCES template_versions(org_id, id),
            FOREIGN KEY (org_id, standard_version_id) REFERENCES standard_versions(org_id, id)
        );
        CREATE INDEX reports_org_state_idx ON reports(org_id, state, created_at);
        CREATE TABLE report_sections (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            report_id uuid NOT NULL,
            section_key text NOT NULL,
            state text NOT NULL DEFAULT 'needs_input' CHECK (state IN ('ready','needs_input','failed')),
            content_json jsonb NOT NULL DEFAULT '{}'::jsonb,
            revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id), UNIQUE (org_id, report_id, section_key),
            FOREIGN KEY (org_id, report_id) REFERENCES reports(org_id, id)
        );
        CREATE TABLE report_versions (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            report_id uuid NOT NULL,
            version integer NOT NULL CHECK (version > 0),
            content_hash char(64) NOT NULL,
            snapshot_json jsonb NOT NULL,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id), UNIQUE (org_id, report_id, version),
            FOREIGN KEY (org_id, report_id) REFERENCES reports(org_id, id)
        );
        CREATE TABLE approvals (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            report_version_id uuid NOT NULL,
            reviewer_membership_id uuid NOT NULL,
            valid boolean NOT NULL DEFAULT true,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id),
            FOREIGN KEY (org_id, report_version_id) REFERENCES report_versions(org_id, id),
            FOREIGN KEY (org_id, reviewer_membership_id) REFERENCES memberships(org_id, id)
        );
        CREATE TABLE exports (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            report_version_id uuid NOT NULL,
            object_key text NOT NULL,
            format text NOT NULL CHECK (format IN ('pdf','docx')),
            is_draft boolean NOT NULL DEFAULT true,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id, id), UNIQUE (org_id, object_key),
            FOREIGN KEY (org_id, report_version_id) REFERENCES report_versions(org_id, id),
            CHECK (left(object_key, length(org_id::text) + 1) = org_id::text || '/')
        );
        CREATE TABLE audit_events (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            actor_membership_id uuid,
            action text NOT NULL,
            target_type text NOT NULL,
            target_id uuid NOT NULL,
            safe_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
            created_at timestamptz NOT NULL DEFAULT now(),
            FOREIGN KEY (org_id, actor_membership_id) REFERENCES memberships(org_id, id)
        );
        CREATE INDEX audit_events_org_time_idx ON audit_events(org_id, created_at);
    """)
    # No browser access to app tables. Prompt 02 adds tested policies and service checks.
    for table in (
        "organizations", "users", "memberships", "projects", "documents", "document_chunks", "templates",
        "template_versions", "report_standards", "standard_versions", "activities",
        "indicators", "reports", "report_sections", "report_versions", "approvals",
        "exports", "audit_events",
    ):
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    for table in (
        "audit_events", "exports", "approvals", "report_versions", "report_sections", "reports",
        "indicators", "activities", "standard_versions", "report_standards", "template_versions",
        "templates", "document_chunks", "documents", "projects", "memberships", "users", "organizations",
    ):
        op.execute(f"DROP TABLE {table}")
