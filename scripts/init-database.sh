#!/bin/bash

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗄️  Initialisation de la base de données${NC}"

# Vérifier si PostgreSQL est en cours d'exécution
if ! docker exec demo-postgres pg_isready -U demo > /dev/null 2>&1; then
    echo -e "${RED}❌ PostgreSQL n'est pas en cours d'exécution${NC}"
    echo -e "${YELLOW}💡 Lancez d'abord: ./scripts/setup-database.sh${NC}"
    exit 1
fi

# Chemin vers les migrations
MIGRATIONS_DIR="$(dirname "$0")/../server/db/migrations"
DATABASE_URL="postgresql://demo:demo@localhost:5432/demo_db"

if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo -e "${RED}❌ Le dossier migrations n'existe pas: $MIGRATIONS_DIR${NC}"
    exit 1
fi

# Exécuter les migrations
echo -e "${BLUE}📝 Exécution des migrations SQL...${NC}"

for migration in "$MIGRATIONS_DIR"/*.sql; do
    if [ -f "$migration" ]; then
        echo -e "${BLUE}   → $(basename "$migration")${NC}"
        if docker exec -i demo-postgres psql -U demo -d demo_db < "$migration" 2>/dev/null; then
            echo -e "${GREEN}   ✅ Migration réussie${NC}"
        else
            echo -e "${YELLOW}   ⚠️  Migration déjà appliquée ou erreur (non bloquant)${NC}"
        fi
    fi
done

echo -e "${GREEN}✅ Base de données initialisée${NC}"

