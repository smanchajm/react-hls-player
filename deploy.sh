#!/bin/bash

# Script de déploiement pour VPS
# Usage: ./deploy.sh

set -e

echo "🚀 Démarrage du déploiement..."

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    exit 1
fi

# Vérifier la version de docker compose
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose (plugin) n'est pas installé${NC}"
    exit 1
fi

# Pull des derniers changements
echo -e "${YELLOW}📥 Pull des derniers changements...${NC}"
git pull origin main

# Arrêt des conteneurs existants
echo -e "${YELLOW}🛑 Arrêt des conteneurs existants...${NC}"
docker compose down

# Rebuild des images
echo -e "${YELLOW}🔨 Build des nouvelles images...${NC}"
docker compose build --no-cache

# Démarrage des conteneurs
echo -e "${YELLOW}▶️  Démarrage des conteneurs...${NC}"
docker compose up -d

# Attendre que les services soient prêts
echo -e "${YELLOW}⏳ Vérification de l'état des services...${NC}"
sleep 5

# Vérifier que les conteneurs tournent
if [ "$(docker ps -q -f name=react-hls-player)" ]; then
    echo -e "${GREEN}✅ Application déployée avec succès!${NC}"
    echo -e "${GREEN}📍 Accessible sur http://localhost${NC}"
    echo -e "${GREEN}📊 Dashboard Traefik: http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Erreur lors du déploiement${NC}"
    docker compose logs
    exit 1
fi

# Nettoyage des anciennes images
echo -e "${YELLOW}🧹 Nettoyage des images inutilisées...${NC}"
docker system prune -af

echo -e "${GREEN}✨ Déploiement terminé!${NC}"
