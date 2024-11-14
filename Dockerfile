# Our 116 (from Main branch)
# base node image
FROM node:20-bookworm-slim AS base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y fuse3 openssl sqlite3 ca-certificates

# Install all node_modules, including dev dependencies
FROM base AS deps

WORKDIR /myapp/heat-stack

ADD heat-stack/package.json heat-stack/package-lock.json heat-stack/.npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base AS production-deps

WORKDIR /myapp/heat-stack

COPY --from=deps /myapp/heat-stack/node_modules /myapp/heat-stack/node_modules
ADD heat-stack/package.json heat-stack/package-lock.json heat-stack/.npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base AS heat-build

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

# Use the following environment variables to configure Sentry
# ENV SENTRY_ORG=
# ENV SENTRY_PROJECT=


WORKDIR /myapp/heat-stack

COPY --from=deps /myapp/heat-stack/node_modules /myapp/heat-stack/node_modules

ADD heat-stack/. .
# Mount the secret and set it as an environment variable and run the build
# RUN npx prisma generate 
RUN npm run build


# RUN mount=type=secret,id=SENTRY_AUTH_TOKEN \
#   export SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) && \
#   npm run build

FROM python:3.12.3-slim-bookworm as rules-build
WORKDIR /myapp
ADD python/. .
RUN bash -c "source setup-wheel.sh"

# Finally, build the production image with minimal heat-stack footprint
FROM base

ENV FLY="true"
ENV LITEFS_DIR="/litefs/data"
ENV DATABASE_FILENAME="sqlite.db"
ENV DATABASE_PATH="$LITEFS_DIR/$DATABASE_FILENAME"
ENV DATABASE_URL="file:$DATABASE_PATH"
ENV CACHE_DATABASE_FILENAME="cache.db"
ENV CACHE_DATABASE_PATH="$LITEFS_DIR/$CACHE_DATABASE_FILENAME"
ENV INTERNAL_PORT="8080"
ENV PORT="8081"
ENV NODE_ENV="production"
# For WAL support: https://github.com/prisma/prisma-engines/issues/4675#issuecomment-1914383246
ENV PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK = "1"

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp/heat-stack

# Generate random value and save it to .env file which will be loaded by dotenv
RUN INTERNAL_COMMAND_TOKEN=$(openssl rand -hex 32) && \
  echo "INTERNAL_COMMAND_TOKEN=$INTERNAL_COMMAND_TOKEN" > .env

COPY --from=production-deps /myapp/heat-stack/node_modules /myapp/heat-stack/node_modules
COPY --from=heat-build /myapp/heat-stack/node_modules/.prisma /myapp/heat-stack/node_modules/.prisma

COPY --from=heat-build /myapp/heat-stack/server-build /myapp/heat-stack/server-build
COPY --from=heat-build /myapp/heat-stack/build /myapp/heat-stack/build

# HEAT Stack custom line for Pyodide
COPY --from=heat-build /myapp/heat-stack/public /myapp/heat-stack/public
COPY --from=heat-build /myapp/heat-stack/package.json /myapp/heat-stack/package.json
COPY --from=heat-build /myapp/heat-stack/prisma /myapp/heat-stack/prisma
COPY --from=heat-build /myapp/heat-stack/app/components/ui/icons /myapp/heat-stack/app/components/ui/icons
COPY --from=rules-build /myapp/dist/*.whl /myapp/heat-stack/public/pyodide-env/



# prepare for litefs
COPY --from=flyio/litefs:0.5.11 /usr/local/bin/litefs /usr/local/bin/litefs
ADD heat-stack/other/litefs.yml /etc/litefs.yml
RUN mkdir -p /data ${LITEFS_DIR}

ADD heat-stack/. .

CMD ["litefs", "mount"]
