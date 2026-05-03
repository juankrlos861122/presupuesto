FROM node:20-alpine

WORKDIR /app/apps/frontend

COPY apps/frontend/package*.json ./
RUN npm install

COPY apps/frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/apps/frontend/dist/presupuesto/browser /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]