# Fix Docker Permissions - Groupe Docker manquant

## Problème
Le groupe `docker` n'existe pas sur le système, ce qui empêche les utilisateurs non-root d'utiliser Docker.

## Solution

### Étape 1: Créer le groupe docker

```bash
# Créer le groupe docker
sudo groupadd docker

# Vérifier que le groupe existe
getent group docker
# Résultat attendu: docker:x:999:
```

### Étape 2: Ajouter votre utilisateur au groupe

```bash
# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

# Vérifier les groupes de l'utilisateur
groups $USER
# Vous devriez voir "docker" dans la liste
```

### Étape 3: Changer le propriétaire du socket Docker

```bash
# Vérifier les permissions actuelles
ls -l /var/run/docker.sock
# Avant: srw-rw---- 1 root root

# Changer le groupe propriétaire
sudo chown root:docker /var/run/docker.sock

# Vérifier à nouveau
ls -l /var/run/docker.sock
# Après: srw-rw---- 1 root docker
```

### Étape 4: Se déconnecter et reconnecter

```bash
# Se déconnecter
exit

# Se reconnecter en SSH
ssh ubuntu@votre-vps-ip

# Vérifier que vous êtes dans le groupe docker
groups
# Vous devriez voir: ubuntu adm ... docker
```

### Étape 5: Tester Docker sans sudo

```bash
# Tester que Docker fonctionne sans sudo
docker ps

# Si ça fonctionne, c'est bon!
# Si erreur persiste, redémarrer le service Docker
sudo systemctl restart docker

# Retester
docker ps
```

## Alternative: Réinstaller Docker proprement

Si le problème persiste, réinstallez Docker correctement:

```bash
# Désinstaller l'ancienne version
sudo apt remove docker docker-engine docker.io containerd runc

# Mettre à jour les paquets
sudo apt update

# Installer les dépendances
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Ajouter la clé GPG officielle de Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Ajouter le repository Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Mettre à jour les paquets
sudo apt update

# Installer Docker Engine
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Vérifier que le groupe docker existe maintenant
getent group docker

# Ajouter l'utilisateur au groupe
sudo usermod -aG docker $USER

# Se déconnecter et reconnecter
exit
```

## Vérification finale

Après reconnexion:

```bash
# Vérifier que vous êtes dans le groupe
groups | grep docker

# Vérifier les permissions du socket
ls -l /var/run/docker.sock
# Attendu: srw-rw---- 1 root docker

# Tester Docker
docker ps
docker compose version

# Tout devrait fonctionner!
```

## Si vous utilisez un autre système

### Pour Debian
Remplacez `ubuntu` par `debian` dans les commandes de repository.

### Pour CentOS/RHEL
```bash
# Installer Docker
sudo yum install -y docker

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Créer le groupe si nécessaire
sudo groupadd docker

# Ajouter l'utilisateur
sudo usermod -aG docker $USER

# Changer les permissions du socket
sudo chown root:docker /var/run/docker.sock
```

## Vérifier que GitHub Actions pourra se connecter

Testez que tout fonctionne:

```bash
# Tester la connexion SSH locale (simule GitHub Actions)
ssh -i ~/.ssh/github_actions localhost docker ps

# Si ça fonctionne, GitHub Actions fonctionnera aussi
```
