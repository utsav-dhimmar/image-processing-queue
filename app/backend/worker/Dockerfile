FROM node:24-alpine

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy root configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all source code
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the worker
WORKDIR /usr/src/app/app/backend/worker
RUN pnpm build

CMD [ "node", "dist/index.js" ]