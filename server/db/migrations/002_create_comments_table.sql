-- Migration pour créer la table comments
-- Exécuter avec: psql postgresql://demo:demo@localhost:5432/demo_db -f server/db/migrations/002_create_comments_table.sql

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id VARCHAR(255) NOT NULL,
    text_id UUID NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_comments_workspace_id ON comments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_comments_text_id ON comments(text_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Commentaires
COMMENT ON TABLE comments IS 'Table pour stocker les commentaires sur les textes';
COMMENT ON COLUMN comments.workspace_id IS 'ID du workspace (isolation des données)';
COMMENT ON COLUMN comments.text_id IS 'ID du texte commenté';
COMMENT ON COLUMN comments.created_by IS 'ID de l''utilisateur qui a créé le commentaire';

