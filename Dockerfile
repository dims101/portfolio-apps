# Stage 1: Build Vite React project
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies cleanly
RUN npm ci

# Copy source code
COPY . .

# Build production bundle into /app/dist
RUN npm run build

# Stage 2: Serve statically with lightweight Nginx (~15MB RAM)
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
