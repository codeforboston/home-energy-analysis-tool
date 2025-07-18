# dev.Dockerfile

FROM node:22-bookworm-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
  python3 python3-pip python3-venv \
  sqlite3 build-essential openssl ca-certificates \
  && apt-get clean

# Create working directory for Remix app
WORKDIR /app

# Copy node dependencies files explicitly
COPY heat-stack/package.json ./
COPY heat-stack/package-lock.json ./
COPY heat-stack/.npmrc ./

# Install dependencies
RUN npm install

# Set up working directory for Python
WORKDIR /py
RUN python3 -m venv venv && \
  . venv/bin/activate && \
  pip install build

# Add SQLite CLI shortcut
RUN echo '#!/bin/sh\nsqlite3 $DATABASE_URL' > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

# Final working directory
WORKDIR /app
