FROM node:20-alpine

WORKDIR /app

COPY package*.json apps/backend/package.json ./
RUN npm install

COPY apps/backend/ .
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]