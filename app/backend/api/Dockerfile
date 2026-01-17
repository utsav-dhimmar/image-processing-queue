FROM node:24-alpine

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy root configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all source code (respects .dockerignore)
COPY . .

# Install dependencies for all workspaces
RUN pnpm install --frozen-lockfile

# Build the API (and dependencies)
WORKDIR /usr/src/app/app/backend/api
RUN pnpm build

EXPOSE 3000

CMD [ "node", "dist/server.js" ]