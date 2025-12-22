# Stage 1: Build de l'application React
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build de production
RUN npm run build

# Stage 2: Serveur HTTP léger avec Caddy
FROM caddy:2-alpine

# Copier les fichiers buildés
COPY --from=builder /app/dist /srv

# Copier la configuration Caddy
COPY Caddyfile /etc/caddy/Caddyfile

# Exposer le port 80
EXPOSE 80
