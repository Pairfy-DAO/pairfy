FROM node:20-slim

WORKDIR /app


COPY package.json .


COPY src/handlers/service-email/package.json ./src/handlers/service-email/
COPY src/handlers/service-query/package.json ./src/handlers/service-query/
COPY src/handlers/service-processor/package.json ./src/handlers/service-processor/
COPY src/handlers/service-product/package.json ./src/handlers/service-product/
COPY src/handlers/service-gateway/package.json ./src/handlers/service-gateway/
COPY src/handlers/service-notification/package.json ./src/handlers/service-notification/

RUN npm install --verbose --no-package-lock


COPY . .


RUN npm run build

EXPOSE 4000


CMD ["npm", "start"]
