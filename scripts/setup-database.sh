#!/bin/bash

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐘 Configuration de PostgreSQL avec Docker${NC}"

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé. Veuillez installer Docker d'abord.${NC}"
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord.${NC}"
    exit 1
fi

# Démarrer PostgreSQL
echo -e "${BLUE}🚀 Démarrage de PostgreSQL avec Docker Compose...${NC}"
cd "$(dirname "$0")/.."

if docker-compose up -d postgres 2>/dev/null || docker compose up -d postgres 2>/dev/null; then
    echo -e "${GREEN}✅ PostgreSQL démarré avec succès${NC}"
else
    echo -e "${RED}❌ Erreur lors du démarrage de PostgreSQL${NC}"
    exit 1
fi

# Attendre que PostgreSQL soit prêt
echo -e "${BLUE}⏳ Attente que PostgreSQL soit prêt...${NC}"
sleep 3

# Vérifier la connexion
if docker exec demo-postgres pg_isready -U demo > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL est prêt et accessible${NC}"
    echo ""
    echo -e "${GREEN}📝 Informations de connexion:${NC}"
    echo -e "   Host: localhost"
    echo -e "   Port: 5432"
    echo -e "   Database: demo_db"
    echo -e "   User: demo"
    echo -e "   Password: demo"
    echo -e "   URL: postgresql://demo:demo@localhost:5432/demo_db"
    echo ""
    echo -e "${YELLOW}💡 Pour créer les tables, exécutez les migrations SQL${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL démarre, veuillez patienter quelques secondes${NC}"
fi

