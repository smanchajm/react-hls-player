# Dépannage - Guide de résolution des problèmes

## Erreur: "permission denied while trying to connect to Docker daemon"

### Cause
L'utilisateur qui exécute le déploiement n'a pas les permissions pour accéder au socket Docker.

### Solution

Sur votre VPS:

```bash
# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

# SE DÉCONNECTER ET SE RECONNECTER (important!)
exit

# Se reconnecter
ssh votre-user@votre-vps-ip

# Vérifier que ça fonctionne
docker ps
```

**Si vous êtes déjà connecté**, vous devez impérativement vous déconnecter et reconnecter pour que le changement de groupe prenne effet.

### Alternative (déconseillé en production)

Si vous ne pouvez pas vous reconnecter immédiatement:

```bash
# Activer le groupe dans la session actuelle (temporaire)
newgrp docker

# Tester
docker ps
```

## Erreur: "no configuration file provided: not found"

### Cause
Docker Compose ne trouve pas le fichier `docker-compose.yml`.

### Solution

```bash
# Vérifier que vous êtes dans le bon dossier
cd /opt/react-hls-player  # ou votre chemin configuré

# Vérifier que le fichier existe
ls -la docker-compose.yml

# Si le fichier n'existe pas, cloner le projet
git clone https://github.com/votre-username/react-hls-player.git .
```

## Erreur: "docker-compose: command not found"

### Cause
Version ancienne de Docker Compose ou pas installé.

### Solution

Docker Compose moderne est un plugin intégré à Docker. Utilisez `docker compose` (avec espace) au lieu de `docker-compose` (avec tiret).

```bash
# Vérifier la version
docker compose version

# Si non installé
sudo apt update
sudo apt install docker-compose-plugin -y
```

## Erreur SSH: "ssh: no key found" ou "unable to authenticate"

### Cause
La clé SSH n'est pas correctement configurée dans GitHub Secrets.

### Solution

Voir le guide [SETUP-SSH-KEY.md](SETUP-SSH-KEY.md) pour la configuration complète.

Points clés:
- La clé doit inclure `-----BEGIN OPENSSH PRIVATE KEY-----` et `-----END OPENSSH PRIVATE KEY-----`
- Copier TOUTE la clé, sans espace supplémentaire
- Les noms des secrets doivent être exacts: `SSH_KEY`, `SSH_HOST`, `SSH_USERNAME`, `SSH_PORT`

## Erreur: "git pull" échoue

### Cause
Le dossier n'est pas un dépôt Git ou les permissions sont incorrectes.

### Solution

```bash
# Se positionner dans le dossier
cd /opt/react-hls-player

# Vérifier que c'est un repo git
git status

# Si erreur "not a git repository"
rm -rf /opt/react-hls-player/*
git clone https://github.com/votre-username/react-hls-player.git .

# Vérifier les permissions
sudo chown -R $USER:$USER /opt/react-hls-player
```

## Erreur: Les conteneurs ne démarrent pas

### Vérification

```bash
# Voir les conteneurs en cours
docker ps

# Voir tous les conteneurs (y compris arrêtés)
docker ps -a

# Voir les logs
docker logs traefik
docker logs react-hls-player

# Voir les logs en temps réel
docker compose logs -f
```

### Solutions courantes

#### Port déjà utilisé

```bash
# Vérifier quel processus utilise le port 80
sudo netstat -tulpn | grep :80

# Arrêter le processus concurrent (exemple: nginx)
sudo systemctl stop nginx
sudo systemctl disable nginx
```

#### Problème de build

```bash
# Nettoyer et reconstruire
docker compose down
docker system prune -af
docker compose build --no-cache
docker compose up -d
```

## Application non accessible depuis l'extérieur

### Vérifications

1. **Conteneurs en cours**:
   ```bash
   docker ps | grep react-hls-player
   docker ps | grep traefik
   ```

2. **Ports ouverts localement**:
   ```bash
   curl http://localhost
   curl http://localhost:8080
   ```

3. **Firewall**:
   ```bash
   # Ubuntu/Debian (UFW)
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 8080/tcp
   sudo ufw status

   # Vérifier les ports ouverts
   sudo netstat -tulpn | grep -E ':(80|443|8080)'
   ```

4. **Configuration Traefik**:
   - Si vous utilisez une IP: remplacer `Host(\`localhost\`)` par `PathPrefix(\`/\`)` dans docker-compose.yml
   - Si vous utilisez un domaine: configurer le DNS et mettre à jour `Host(\`votre-domaine.com\`)`

## GitHub Action échoue

### Voir les logs

1. Aller sur GitHub → onglet **Actions**
2. Cliquer sur le workflow qui a échoué
3. Cliquer sur l'étape qui a échoué pour voir les détails

### Problèmes courants

- **SSH fails**: Vérifier les secrets GitHub (SSH_KEY, SSH_HOST, etc.)
- **Build fails**: Vérifier les logs de build, souvent un problème TypeScript
- **Deploy fails**: Vérifier les permissions Docker sur le VPS

## Commandes utiles

```bash
# Redémarrer tout
docker compose down && docker compose up -d

# Voir les logs en temps réel
docker compose logs -f

# Rebuild complet
docker compose down
docker system prune -af
docker compose build --no-cache
docker compose up -d

# Vérifier l'état
docker ps
docker compose ps

# Nettoyer complètement
docker compose down -v
docker system prune -af --volumes
```

## Besoin d'aide supplémentaire?

1. Vérifiez les logs: `docker compose logs`
2. Vérifiez l'état: `docker ps`
3. Vérifiez le réseau: `docker network ls`
4. Consultez la documentation Traefik: https://doc.traefik.io/traefik/
