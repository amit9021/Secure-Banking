# Infrastructure & Deployment

This directory contains Docker configurations and deployment resources for the Secure Banking application.

## Table of Contents

- [Quick Start](#quick-start)
- [Docker Compose Files](#docker-compose-files)
- [Service Architecture](#service-architecture)
- [Port Mapping](#port-mapping)
- [Environment Variables](#environment-variables)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Development Mode

Start all services (client, server, MongoDB) with hot-reload:

```bash
# From project root
docker-compose -f infra/docker-compose.yml up

# Or with rebuild
docker-compose -f infra/docker-compose.yml up --build

# Run in detached mode
docker-compose -f infra/docker-compose.yml up -d
```

### Stop Services

```bash
docker-compose -f infra/docker-compose.yml down

# Stop and remove volumes (clears database)
docker-compose -f infra/docker-compose.yml down -v
```

## Docker Compose Files

| File | Purpose | Use Case |
|------|---------|----------|
| `docker-compose.yml` | Development environment | Local development with hot-reload |
| `docker-compose.prod.yml` | Production environment | Production deployment with optimized builds |

## Service Architecture

### Development Services

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                    (app-network)                         │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Client     │  │   Server     │  │   MongoDB    │ │
│  │              │  │              │  │              │ │
│  │  React App   │─▶│  Express API │─▶│   Database   │ │
│  │  Port 3000   │  │  Port 5000   │  │  Port 27017  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Services Overview

#### 1. Client (React Frontend)

- **Base Image:** `node:18-alpine`
- **Port:** 3000
- **Features:**
  - Hot module replacement (HMR)
  - Live reload on code changes
  - Volume mounted source code
- **Environment:**
  - `REACT_APP_API_URL`: Backend API URL
  - `CHOKIDAR_USEPOLLING`: Enables file watching in Docker

#### 2. Server (Express Backend)

- **Base Image:** `node:18`
- **Port:** 5000
- **Features:**
  - Auto-restart on code changes (nodemon)
  - Volume mounted source code
  - Connected to MongoDB
- **Environment:**
  - `NODE_ENV`: development/production
  - `MONGODB_URI`: MongoDB connection string
  - `JWT_TOKEN`: Secret for JWT signing
  - `TWILIO_*`: SMS/OTP service credentials

#### 3. MongoDB (Database)

- **Image:** `mongo:7`
- **Port:** 27017
- **Features:**
  - Persistent data volumes
  - Health checks
  - Auto-initialization
- **Volumes:**
  - `mongodb_data`: Database files
  - `mongodb_config`: Configuration files

## Port Mapping

| Service | Internal Port | External Port | Access URL |
|---------|---------------|---------------|------------|
| Client (Dev) | 3000 | 3000 | http://localhost:3000 |
| Client (Prod) | 80 | 80 | http://localhost |
| Server | 5000 | 5000 | http://localhost:5000 |
| MongoDB | 27017 | 27017 | mongodb://localhost:27017 |

## Environment Variables

### Required Variables

Create a `.env` file in the `infra/` directory:

```bash
# JWT Secret (generate with: openssl rand -hex 32)
JWT_TOKEN=your_secure_jwt_secret_here

# Twilio Credentials (for OTP functionality)
TWILIO_ACCOUNT_ID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
TWILIO_SERVICE=your_twilio_messaging_service_sid

# Database (optional override)
MONGODB_URI=mongodb://mongodb:27017/bank_users
```

### Loading Environment Variables

```bash
# Option 1: Export before running
export JWT_TOKEN=your_secret
docker-compose -f infra/docker-compose.yml up

# Option 2: Use .env file (recommended)
# Create infra/.env with your variables
docker-compose -f infra/docker-compose.yml up
```

## Production Deployment

### Build Production Images

```bash
# Build all services
docker-compose -f infra/docker-compose.prod.yml build

# Build specific service
docker-compose -f infra/docker-compose.prod.yml build client
```

### Run in Production Mode

```bash
# Ensure environment variables are set
export JWT_TOKEN=production_secret
export MONGODB_URI=mongodb://mongodb:27017/bank_users
# ... other vars

# Start services
docker-compose -f infra/docker-compose.prod.yml up -d
```

### Production Features

- **Client:** Nginx-served optimized React build with gzip compression
- **Server:** Production mode with optimized settings
- **MongoDB:** Enhanced health checks and restart policies
- **All Services:** Automatic restart on failure

## Docker Commands Cheat Sheet

### View Logs

```bash
# All services
docker-compose -f infra/docker-compose.yml logs

# Specific service
docker-compose -f infra/docker-compose.yml logs server

# Follow logs (tail -f)
docker-compose -f infra/docker-compose.yml logs -f client
```

### Execute Commands in Containers

```bash
# Access MongoDB shell
docker-compose -f infra/docker-compose.yml exec mongodb mongosh bank_users

# Access server container bash
docker-compose -f infra/docker-compose.yml exec server sh

# Run seed script
docker-compose -f infra/docker-compose.yml exec server node scripts/seed.js
```

### Manage Containers

```bash
# List running containers
docker-compose -f infra/docker-compose.yml ps

# Restart specific service
docker-compose -f infra/docker-compose.yml restart server

# Stop specific service
docker-compose -f infra/docker-compose.yml stop mongodb

# Remove stopped containers
docker-compose -f infra/docker-compose.yml rm
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect secure-banking_mongodb_data

# Remove all volumes (CAUTION: deletes data)
docker-compose -f infra/docker-compose.yml down -v
```

## Troubleshooting

### MongoDB Connection Issues

**Problem:** Server can't connect to MongoDB

**Solutions:**
```bash
# 1. Check MongoDB health
docker-compose -f infra/docker-compose.yml ps

# 2. View MongoDB logs
docker-compose -f infra/docker-compose.yml logs mongodb

# 3. Verify network connectivity
docker-compose -f infra/docker-compose.yml exec server ping mongodb

# 4. Restart MongoDB
docker-compose -f infra/docker-compose.yml restart mongodb
```

### Port Already in Use

**Problem:** `bind: address already in use`

**Solutions:**
```bash
# Find process using port
lsof -i :3000  # or :5000, :27017

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use host port 3001
```

### Changes Not Reflecting

**Problem:** Code changes not showing up

**Solutions:**
```bash
# 1. Restart the service
docker-compose -f infra/docker-compose.yml restart client

# 2. Rebuild the service
docker-compose -f infra/docker-compose.yml up --build client

# 3. Clear Docker cache
docker-compose -f infra/docker-compose.yml build --no-cache
```

### Container Keeps Restarting

**Problem:** Service continuously restarts

**Solutions:**
```bash
# 1. Check logs for errors
docker-compose -f infra/docker-compose.yml logs --tail=50 server

# 2. Check environment variables
docker-compose -f infra/docker-compose.yml config

# 3. Run container interactively
docker-compose -f infra/docker-compose.yml run server sh
```

### Database Data Persistence

**Problem:** Database data lost after restart

**Solution:**
```bash
# Verify volumes are created
docker volume ls | grep mongodb

# Check volume mount
docker-compose -f infra/docker-compose.yml config | grep mongodb_data

# Backup database
docker-compose -f infra/docker-compose.yml exec mongodb mongodump --out=/backup
```

## AWS Deployment (EC2/ECR)

### Push to ECR

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region eu-west-2 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.eu-west-2.amazonaws.com

# Build and tag image
docker build -t secure-banking-server ./server
docker tag secure-banking-server:latest <account-id>.dkr.ecr.eu-west-2.amazonaws.com/secure-banking:latest

# Push to ECR
docker push <account-id>.dkr.ecr.eu-west-2.amazonaws.com/secure-banking:latest
```

### Deploy on EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Pull from ECR
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin <ecr-url>
docker pull <ecr-url>/secure-banking:latest

# Run container
docker run -d -p 5000:5000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e JWT_TOKEN=your_jwt_secret \
  <ecr-url>/secure-banking:latest
```

## Performance Optimization

### Resource Limits

Add resource constraints to docker-compose.yml:

```yaml
services:
  server:
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Multi-Stage Builds

Both production Dockerfiles use multi-stage builds to reduce image size:

- **Client:** Build stage (Node) → Production stage (Nginx)
- **Server:** Single optimized stage with production dependencies only

## Security Considerations

1. **Never commit `.env` files** with real credentials
2. **Use Docker secrets** for sensitive data in production
3. **Regularly update base images** for security patches
4. **Run containers as non-root** user (TODO: implement)
5. **Use specific image tags** instead of `latest` in production
6. **Enable Docker Content Trust** for image verification

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

---

**Need Help?** Check the [main README](../README.md) or open an issue.
