# dev.Dockerfile

FROM node:22-bookworm-slim

RUN echo "⚠️ This Dockerfile is not recommended for current development use. See docs/decision-records/docker-for-dev.md for more info." && exit 1

# Install system dependencies
RUN apt-get update && apt-get install -y \
  python3 python3-pip python3-venv \
  sqlite3 build-essential openssl ca-certificates \
  && apt-get clean

WORKDIR /py
RUN python3 -m venv venv && \
  . venv/bin/activate && \
  pip install build

# Create working directory for Remix app
WORKDIR /app

# Copy node dependencies files explicitly
COPY heat-stack/package.json ./
COPY heat-stack/package-lock.json ./
COPY heat-stack/.npmrc ./
COPY heat-stack/.env.example ./.env

# Install dependencies
# Set up working directory for Python

RUN npm install

# Add SQLite CLI shortcut
RUN echo '#!/bin/sh\nsqlite3 $DATABASE_URL' > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

# Final working directory
WORKDIR /app
