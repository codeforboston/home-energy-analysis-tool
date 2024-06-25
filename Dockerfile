# base node image
FROM node:20-bookworm-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y fuse3 openssl sqlite3 ca-certificates

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp/heat-stack

ADD heat-stack/package.json heat-stack/package-lock.json heat-stack/.npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp/heat-stack

COPY --from=deps /myapp/heat-stack/node_modules /myapp/heat-stack/node_modules
ADD heat-stack/package.json heat-stack/package-lock.json heat-stack/.npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as heat-build

WORKDIR /myapp/heat-stack

COPY --from=deps /myapp/heat-stack/node_modules /myapp/heat-stack/node_modules

ADD heat-stack/prisma .
RUN npx prisma generate

ADD heat-stack/. .
RUN npm run build

FROM python:3.12.3-slim-bookworm as rules-build
WORKDIR /myapp
ADD rules-engine/. .
RUN bash -c "source setup-wheel.sh"


# Finally, build the production image with minimal heat-stacktprint
FROM base

ENV FLY="true"
ENV LITEFS_DIR="/litefs/data"
ENV DATABASE_FILENAME="sqlite.db"
ENV DATABASE_PATH="$LITEFS_DIR/$DATABASE_FILENAME"
ENV DATABASE_URL="file:$DATABASE_PATH"
ENV CACHE_DATABASE_FILENAME="cache.db"
ENV CACHE_DATABASE_PATH="/$LITEFS_DIR/$CACHE_DATABASE_FILENAME"
ENV INTERNAL_PORT="8080"
ENV PORT="8081"
ENV NODE_ENV="production"

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp

COPY --from=production-deps /myapp/heat-stack/node_modules /myapp/heat-stack/node_modules
COPY --from=build /myapp/heat-stack/node_modules/.prisma /myapp/heat-stack/node_modules/.prisma

COPY --from=build /myapp/heat-stack/server-build /myapp/heat-stack/server-build
COPY --from=build /myapp/heat-stack/build /myapp/heat-stack/build
COPY --from=build /myapp/heat-stack/public /myapp/heat-stack/public
COPY --from=build /myapp/heat-stack/package.json /myapp/heat-stack/package.json
COPY --from=build /myapp/heat-stack/prisma /myapp/heat-stack/prisma
COPY --from=build /myapp/heat-stack/app/components/ui/icons /myapp/heat-stack/app/components/ui/icons
COPY --from=rules /myapp/dist/*.whl /myapp/heat-stack/public

# prepare for litefs
COPY --from=flyio/litefs:0.5.8 /usr/local/bin/litefs /usr/local/bin/litefs
ADD heat-stack/other/litefs.yml /etc/litefs.yml
RUN mkdir -p /data ${LITEFS_DIR}

ADD heat-stack/. .

CMD ["litefs", "mount"]


