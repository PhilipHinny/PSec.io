"""Invitation lifecycle and audit-safe identity foundations."""

from alembic import op

revision = "0002_identity"
down_revision = "0001_foundation"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        CREATE TABLE invitations (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            org_id uuid NOT NULL REFERENCES organizations(id),
            email text NOT NULL CHECK (email = lower(trim(email)) AND length(email) > 3),
            role text NOT NULL CHECK (role IN ('admin','manager','contributor','viewer')),
            token_hash char(64) NOT NULL UNIQUE,
            invited_by_membership_id uuid NOT NULL,
            expires_at timestamptz NOT NULL,
            accepted_at timestamptz,
            revoked_at timestamptz,
            created_at timestamptz NOT NULL DEFAULT now(),
            UNIQUE (org_id,id),
            FOREIGN KEY (org_id, invited_by_membership_id) REFERENCES memberships(org_id,id)
        );
        CREATE INDEX invitations_org_email_idx ON invitations(org_id,email);
        ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
    """)


def downgrade() -> None:
    op.execute("DROP TABLE invitations")
