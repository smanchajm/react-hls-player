# Guide de déploiement Docker

## 🚀 Déploiement rapide sur VPS

### Prérequis

- Docker installé sur votre VPS
- Docker Compose installé
- Git installé

### Option 1 : Déploiement simple (sans reverse proxy)

```bash
# 1. Cloner le projet sur votre VPS
git clone <votre-repo-url>
cd react-hls-player

# 2. Builder et lancer le container
docker-compose up -d

# 3. Vérifier que ça tourne
docker-compose ps
```

L'application sera accessible sur **http://votre-vps-ip:8080**

### Option 2 : Avec Traefik (reverse proxy + HTTPS automatique)

Si vous voulez ajouter Traefik pour gérer HTTPS et les domaines :

#### Étape 1 : Créer un réseau Docker

```bash
docker network create traefik-network
```

#### Étape 2 : Modifier docker-compose.yml

Remplacez le contenu par :

```yaml
version: '3.8'

services:
  web:
    build: .
    container_name: react-hls-player
    networks:
      - traefik-network
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.hls-player.rule=Host(`player.votre-domaine.com`)"
      - "traefik.http.routers.hls-player.entrypoints=websecure"
      - "traefik.http.routers.hls-player.tls.certresolver=letsencrypt"
      - "traefik.http.services.hls-player.loadbalancer.server.port=80"

networks:
  traefik-network:
    external: true
```

#### Étape 3 : Configuration Traefik

Créez `docker-compose.traefik.yml` :

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    container_name: traefik
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=votre@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt
    networks:
      - traefik-network
    restart: unless-stopped

networks:
  traefik-network:
    external: true
```

#### Étape 4 : Lancer Traefik puis votre app

```bash
# Lancer Traefik
docker-compose -f docker-compose.traefik.yml up -d

# Lancer votre app
docker-compose up -d
```

Votre app sera accessible sur **https://player.votre-domaine.com** avec HTTPS automatique !

## 🛠️ Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Arrêter l'application
docker-compose down

# Rebuild après des modifications
docker-compose up -d --build

# Voir les containers en cours
docker ps

# Entrer dans le container
docker exec -it react-hls-player sh
```

## 🔧 Configuration avancée

### Changer le port

Dans `docker-compose.yml`, modifiez :
```yaml
ports:
  - "3000:80"  # Sera accessible sur le port 3000
```

### Variables d'environnement

Si vous avez besoin de variables d'environnement au build :

```dockerfile
# Dans Dockerfile, ajoutez avant RUN npm run build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
```

Puis dans docker-compose.yml :
```yaml
build:
  context: .
  args:
    VITE_API_URL: https://api.votre-domaine.com
```

## 📊 Monitoring

### Vérifier l'état de santé

```bash
# Vérifier que nginx répond
curl http://localhost:8080

# Voir la consommation de ressources
docker stats react-hls-player
```

## 🔄 Mise à jour de l'application

```bash
# Sur votre VPS
cd react-hls-player
git pull
docker-compose up -d --build
```

## 🚨 Dépannage

### Le container ne démarre pas

```bash
# Voir les logs d'erreur
docker-compose logs

# Vérifier le build
docker-compose build
```

### Port déjà utilisé

```bash
# Trouver ce qui utilise le port 8080
netstat -tulpn | grep 8080

# Ou changer le port dans docker-compose.yml
```

## 📝 Recommandation

**Pour un simple test** : Option 1 (sans Traefik)
**Pour la production** : Option 2 (avec Traefik + HTTPS)

Traefik ajoute :
- ✅ HTTPS automatique (Let's Encrypt)
- ✅ Gestion de plusieurs domaines
- ✅ Renouvellement automatique des certificats
- ✅ Dashboard de monitoring

Mais c'est plus complexe à configurer initialement.
