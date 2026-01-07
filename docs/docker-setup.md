# Docker Setup

This document covers the Docker configuration for the monorepo.

## Prerequisites

- Docker 20.10 or later
- Docker Compose v2

## Project Structure

```
monorepo/
├── Dockerfile          # Multi-stage Dockerfile
├── docker-compose.yml  # Docker Compose configuration
├── nginx.conf          # Nginx config for production
├── .dockerignore       # Files to exclude from Docker builds
├── apps/               # Application packages (Vite/React)
└── packages/           # Shared packages
```

## Dockerfile Stages

The Dockerfile uses multi-stage builds for efficiency:

| Stage | Purpose |
|-------|---------|
| `base` | Base image with Node.js 20 and pnpm |
| `deps` | Installs dependencies |
| `builder` | Builds all packages |
| `development` | Development environment with hot reload |
| `production` | Nginx serving built static files |

## Commands

### Development

Start the development environment with hot reload:

```bash
docker compose up
```

Or run in detached mode:

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f app
```

### Production

Build and run the production image:

```bash
docker compose --profile production up app-prod
```

Or build the production image directly:

```bash
docker build --target production -t monorepo:prod .
docker run -p 80:80 monorepo:prod
```

### Building Specific Stages

```bash
# Development image
docker build --target development -t monorepo:dev .

# Production image
docker build --target production -t monorepo:prod .
```

### Stopping Containers

```bash
docker compose down
```

Remove volumes as well:

```bash
docker compose down -v
```

## Environment Variables

Create a `.env` file in the project root for environment-specific configuration:

```bash
cp .env.example .env
```

Variables are automatically loaded by Docker Compose.

## Volumes

The development configuration mounts the source code as a volume for hot reload:

- `.:/app` - Source code
- `/app/node_modules` - Preserved root node_modules
- `/app/apps/web/node_modules` - Preserved web app node_modules

## Networking

Default ports:

| Service | Port | URL |
|---------|------|-----|
| app (dev) | 5173 | http://localhost:5173 |
| app-prod | 80 | http://localhost |

Modify `docker-compose.yml` to change port mappings:

```yaml
ports:
  - "3000:5173"  # Maps host 3000 to container 5173
```

## Troubleshooting

### Permission Issues

If you encounter permission errors:

```bash
# Fix ownership
sudo chown -R $(whoami) .
```

### Cache Issues

Clear Docker build cache:

```bash
docker builder prune
```

Rebuild without cache:

```bash
docker compose build --no-cache
```

### Node Modules Issues

If you see errors like `vite: not found` or `sh: <package>: not found`, this is caused by stale Docker volumes caching old node_modules that don't match current dependencies.

**Fix:**

```bash
# Remove containers and volumes
docker compose down -v

# Rebuild and start fresh
docker compose build --no-cache
docker compose up
```

This clears the anonymous volumes that preserve node_modules and rebuilds with fresh dependencies.

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
- name: Build Docker image
  run: docker build --target production -t myapp:${{ github.sha }} .

- name: Push to registry
  run: |
    docker tag myapp:${{ github.sha }} registry.example.com/myapp:latest
    docker push registry.example.com/myapp:latest
```
