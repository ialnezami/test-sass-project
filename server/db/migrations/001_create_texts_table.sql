-- Migration pour créer la table texts
-- Exécuter avec: psql postgresql://demo:demo@localhost:5432/demo_db -f server/db/migrations/001_create_texts_table.sql

CREATE TABLE IF NOT EXISTS texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_texts_workspace_id ON texts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_texts_created_at ON texts(created_at DESC);

-- Commentaires
COMMENT ON TABLE texts IS 'Table pour stocker les textes créés par les utilisateurs';
COMMENT ON COLUMN texts.workspace_id IS 'ID du workspace (isolation des données)';
COMMENT ON COLUMN texts.created_by IS 'ID de l''utilisateur qui a créé le texte';

