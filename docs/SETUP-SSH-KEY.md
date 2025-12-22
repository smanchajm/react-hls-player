# Guide: Configuration de la clé SSH pour GitHub Actions

## Étape 1: Générer la clé SSH sur le VPS

Connectez-vous à votre VPS et exécutez:

```bash
# Se connecter au VPS
ssh votre-user@votre-vps-ip

# Générer une nouvelle clé SSH ED25519 (plus sûr et compatible)
ssh-keygen -t ed25519 -f ~/.ssh/github_actions -C "github-actions" -N ""

# Ajouter la clé publique aux clés autorisées
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Définir les bonnes permissions (IMPORTANT!)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/github_actions
chmod 644 ~/.ssh/github_actions.pub

# Afficher la clé PRIVÉE (à copier dans GitHub)
cat ~/.ssh/github_actions
```

## Étape 2: Copier la clé privée

La commande `cat ~/.ssh/github_actions` affiche quelque chose comme:

```
-----BEGIN OPENSSH PRIVATE KEY-----
[VOTRE CLÉ PRIVÉE ICI - Longue chaîne de caractères encodés en base64]
[Ne partagez JAMAIS cette clé publiquement!]
-----END OPENSSH PRIVATE KEY-----
```

**IMPORTANT**: Vous devez copier **TOUT LE CONTENU**, y compris:
- La ligne `-----BEGIN OPENSSH PRIVATE KEY-----`
- Tout le texte encodé au milieu
- La ligne `-----END OPENSSH PRIVATE KEY-----`

## Étape 3: Configurer les secrets dans GitHub

1. Allez sur votre dépôt GitHub: https://github.com/votre-username/react-hls-player

2. Cliquez sur **Settings** (en haut)

3. Dans le menu de gauche: **Secrets and variables** → **Actions**

4. Cliquez sur **New repository secret** et ajoutez:

### Secret 1: SSH_KEY
```
Nom: SSH_KEY
Valeur: [Coller TOUTE la clé privée de l'étape 2]
```

### Secret 2: SSH_HOST
```
Nom: SSH_HOST
Valeur: [L'IP de votre VPS, exemple: 203.0.113.42]
```

### Secret 3: SSH_USERNAME
```
Nom: SSH_USERNAME
Valeur: [Votre nom d'utilisateur SSH, exemple: ubuntu ou root]
```

### Secret 4: SSH_PORT
```
Nom: SSH_PORT
Valeur: 22
```

### Secret 5: VPS_DEPLOY_PATH (optionnel)
```
Nom: VPS_DEPLOY_PATH
Valeur: /opt/react-hls-player
```

## Étape 4: Tester la connexion SSH manuellement

Sur votre VPS, testez que la clé fonctionne:

```bash
# Tester la connexion SSH avec la clé
ssh -i ~/.ssh/github_actions localhost

# Si ça fonctionne, vous devriez être connecté sans mot de passe
# Tapez 'exit' pour sortir
```

## Étape 5: Vérifier que le projet est cloné sur le VPS

```bash
# Créer le dossier si nécessaire
sudo mkdir -p /opt/react-hls-player
sudo chown $USER:$USER /opt/react-hls-player

# Cloner le projet (si pas déjà fait)
cd /opt/react-hls-player
git clone https://github.com/votre-username/react-hls-player.git .

# OU si déjà cloné, vérifier que c'est bien un repo git
git status
```

## Étape 6: Tester le déploiement

Faites un commit et push pour déclencher la GitHub Action:

```bash
# Sur votre machine locale
git add .
git commit -m "Test SSH deployment"
git push origin main
```

Allez dans l'onglet **Actions** de votre dépôt GitHub pour voir les logs.

## Dépannage

### Erreur: "ssh: no key found"
- La clé n'a pas été copiée entièrement dans GitHub Secrets
- Assurez-vous de copier les lignes BEGIN et END

### Erreur: "Permission denied"
- Vérifiez les permissions: `chmod 600 ~/.ssh/github_actions`
- Vérifiez que la clé publique est dans authorized_keys

### Erreur: "Host key verification failed"
- Ajoutez cette option dans le workflow (déjà fait dans deploy.yml)

### Le git pull échoue
- Assurez-vous que le projet est bien cloné sur le VPS
- Vérifiez que vous êtes dans le bon dossier
