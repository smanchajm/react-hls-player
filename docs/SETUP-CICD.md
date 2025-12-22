# Configuration CI/CD - GitHub Actions vers VPS

Ce guide explique comment configurer le déploiement automatique de l'application sur votre VPS via GitHub Actions.

## Prérequis sur le VPS

### 1. Installer Docker et Docker Compose

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Installer Docker Compose
sudo apt install docker-compose-plugin -y

# Vérifier l'installation
docker --version
docker compose version
```

### 2. Installer Git

```bash
sudo apt install git -y
```

### 3. Cloner le projet sur le VPS

```bash
# Créer le répertoire de déploiement
sudo mkdir -p /opt/react-hls-player
sudo chown $USER:$USER /opt/react-hls-player

# Cloner le dépôt
cd /opt/react-hls-player
git clone https://github.com/votre-username/react-hls-player.git .
```

### 4. Configuration initiale

```bash
# Créer le dossier pour les certificats SSL
mkdir -p letsencrypt

# Tester le déploiement manuel
./deploy.sh
```

## Configuration des secrets GitHub

### 1. Générer une clé SSH pour GitHub Actions

Sur votre VPS:

```bash
# Générer une nouvelle clé SSH (sans passphrase)
ssh-keygen -t ed25519 -f ~/.ssh/github_actions -N ""

# Ajouter la clé publique aux clés autorisées
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Afficher la clé privée (à copier dans GitHub)
cat ~/.ssh/github_actions
```

### 2. Configurer les secrets dans GitHub

Allez dans votre dépôt GitHub: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Ajoutez les secrets suivants:

| Nom du secret | Description | Exemple |
|---------------|-------------|---------|
| `VPS_HOST` | Adresse IP ou nom de domaine de votre VPS | `203.0.113.42` ou `vps.example.com` |
| `VPS_USERNAME` | Nom d'utilisateur SSH | `ubuntu` ou `root` |
| `VPS_SSH_KEY` | Clé privée SSH (contenu de `~/.ssh/github_actions`) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `VPS_PORT` | Port SSH (optionnel, défaut: 22) | `22` |
| `VPS_DEPLOY_PATH` | Chemin du projet sur le VPS (optionnel) | `/opt/react-hls-player` |

### 3. Tester la configuration

Faites un commit et poussez sur la branche `main`:

```bash
git add .
git commit -m "Test CI/CD pipeline"
git push origin main
```

La GitHub Action se lancera automatiquement. Vous pouvez suivre l'exécution dans l'onglet **Actions** de votre dépôt.

## Configuration pour la production (HTTPS)

### 1. Configurer votre nom de domaine

Pointez votre nom de domaine vers l'IP de votre VPS (enregistrement A dans votre DNS).

### 2. Modifier docker-compose.yml

Sur votre VPS, éditez `/opt/react-hls-player/docker-compose.yml`:

```bash
nano docker-compose.yml
```

Décommentez les lignes Let's Encrypt et remplacez:
- `votre-domaine.com` par votre vrai nom de domaine
- `votre-email@example.com` par votre email

### 3. Redéployer

```bash
./deploy.sh
```

Let's Encrypt obtiendra automatiquement un certificat SSL. Votre application sera accessible en HTTPS.

## Déploiement manuel

Si vous voulez déployer manuellement sans passer par GitHub Actions:

```bash
# Se connecter au VPS
ssh user@votre-vps

# Aller dans le répertoire du projet
cd /opt/react-hls-player

# Lancer le script de déploiement
./deploy.sh
```

## Workflow CI/CD

Le pipeline GitHub Actions effectue automatiquement:

1. **Sur tous les push et PR**:
   - Installation des dépendances
   - Vérification TypeScript (`npm run lint`)
   - Build de l'application

2. **Uniquement sur push vers main**:
   - Connexion SSH au VPS
   - Pull des derniers changements
   - Rebuild des images Docker
   - Redémarrage des conteneurs
   - Nettoyage des anciennes images

## Surveillance et logs

### Voir les logs des conteneurs

```bash
# Logs de l'application
docker logs react-hls-player

# Logs de Traefik
docker logs traefik

# Logs en temps réel
docker-compose logs -f
```

### Vérifier l'état des services

```bash
# Statut des conteneurs
docker ps

# Ressources utilisées
docker stats
```

## Dépannage

### Le déploiement échoue

1. Vérifier les logs GitHub Actions
2. Se connecter au VPS et vérifier les logs: `docker-compose logs`
3. Vérifier que les secrets GitHub sont correctement configurés

### Problème de connexion SSH

```bash
# Tester la connexion SSH
ssh -i ~/.ssh/github_actions user@vps-ip

# Vérifier les permissions
chmod 600 ~/.ssh/github_actions
chmod 644 ~/.ssh/github_actions.pub
```

### Certificat SSL non obtenu

1. Vérifier que le domaine pointe bien vers votre VPS
2. Vérifier que les ports 80 et 443 sont ouverts dans le firewall
3. Consulter les logs Traefik: `docker logs traefik`

## Firewall (UFW)

Si vous utilisez UFW, ouvrez les ports nécessaires:

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```
