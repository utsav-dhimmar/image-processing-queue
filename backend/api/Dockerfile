# base image
FROM node:24-alpine

# set working directory inside container
WORKDIR /app

# copy package.json and pnpm-lock.yml
COPY package.json ./
COPY pnpm-lock.yaml ./

# install dependecny
RUN npm i -g pnpm && pnpm install --frozen-lockfile

# copy everything inside constainer
COPY . .

# expose the port

EXPOSE 3000


# start application
CMD [ "node","app.js" ]
