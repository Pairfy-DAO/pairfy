FROM node:20-slim

WORKDIR /app

COPY package.json .

RUN ls

RUN npm install --verbose --no-package-lock

COPY . .

RUN npm run build

EXPOSE 8005

CMD ["sh", "-c", "npm run database && npm start"]