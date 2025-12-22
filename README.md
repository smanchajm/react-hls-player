# React HLS Player

Lecteur vidéo web pour streaming HLS avec interface simple pour étudiants.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le serveur démarre sur **http://localhost:5173**

## 📦 Technologies

- **React 19** + **TypeScript**
- **Vite** - Build tool rapide
- **hls.js** - Lecteur vidéo HLS
- **shadcn/ui** + **Tailwind CSS** - Interface utilisateur
- **React Router** - Navigation

## 🎯 Fonctionnalités

- Page d'accueil avec saisie d'ID de session
- Lecteur vidéo HLS avec support multi-navigateurs
- Interface en mode clair
- Gestion des erreurs de streaming
- Hot Module Replacement (rechargement automatique)

## 🛠️ Commandes disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Preview du build de production
npm run lint     # Vérification TypeScript
```

## 📁 Structure du projet

```
src/
├── components/
│   ├── ui/              # Composants shadcn/ui
│   └── VideoPlayer.tsx  # Lecteur HLS
├── pages/
│   ├── Home.tsx         # Page d'accueil
│   └── Player.tsx       # Page lecteur vidéo
├── lib/
│   └── utils.ts         # Utilitaires
├── App.tsx              # Configuration des routes
└── main.tsx             # Point d'entrée
```

## 🔧 Configuration

### URL du flux HLS

Par défaut, le lecteur cherche le flux à `/video/{flux_id}/index.m3u8`

Modifiez dans `src/components/VideoPlayer.tsx` si nécessaire :

```typescript
const streamUrl = `/video/${fluxId}/index.m3u8`
```

## 🐳 Déploiement

### Déploiement avec Docker + Traefik

```bash
# Cloner le projet
git clone <votre-repo>
cd react-hls-player

# Lancer avec Docker Compose
docker compose up -d
```

L'application sera accessible sur **http://votre-vps-ip** (port 80)

### CI/CD avec GitHub Actions

Le projet inclut une pipeline CI/CD complète pour déploiement automatique sur VPS.

📚 **Documentation complète:**
- [DEPLOY.md](./DEPLOY.md) - Guide de déploiement Docker
- [docs/SETUP-CICD.md](./docs/SETUP-CICD.md) - Configuration CI/CD
- [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) - Résolution de problèmes

## 📝 Notes

- Le rechargement automatique est activé par défaut avec Vite
- Pour arrêter le serveur : `Ctrl + C`
- Compatible Safari (support HLS natif) et autres navigateurs (via hls.js)
