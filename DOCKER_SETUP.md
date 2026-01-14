# Docker Setup

This guide explains how to run the monorepo using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2

## Development Mode

Run the development server with hot module replacement (HMR):

```bash
docker compose up
```

This will:
- Build the development image
- Mount the source code as a volume for live reloading
- Start the Vite dev server on **port 5175**
- Watch for file changes

Access the application at: http://localhost:5175

### Rebuilding After Dependency Changes

If you modify `package.json` or `pnpm-lock.yaml`:

```bash
docker compose up --build
```

### Running in Background

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f
```

## Production Mode

Build and run the production image with nginx:

```bash
docker compose --profile production up
```

This will:
- Build the application for production
- Serve static files via nginx on **port 8080**

Access the application at: http://localhost:8080

### Production Build Only

To build without starting:

```bash
docker compose --profile production build
```

## Stopping Containers

```bash
# Stop development
docker compose down

# Stop production
docker compose --profile production down
```

## Docker Architecture

The Dockerfile uses multi-stage builds:

| Stage | Purpose |
|-------|---------|
| `base` | Node.js 20 Alpine with pnpm |
| `deps` | Install dependencies |
| `builder` | Build production assets |
| `development` | Dev server with source mounting |
| `production` | Nginx serving built assets |

## Volumes

Development mode mounts:
- `.:/app` - Source code for live reloading
- `/app/node_modules` - Preserved node_modules (not overwritten by host)
- `/app/apps/web/node_modules` - Preserved web app node_modules

## Ports

| Mode | Port | Description |
|------|------|-------------|
| Development | 5175 | Vite dev server with HMR |
| Production | 8080 | Nginx static file server |

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :5175

# Use a different port
docker compose run -p 3000:5175 app
```

### Permission Issues

If you encounter permission errors with mounted volumes:

```bash
docker compose down -v
docker compose up --build
```

### Clear Docker Cache

```bash
docker compose down -v
docker system prune -f
docker compose up --build
```
