# Этап 1 — сборка
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

# Явно задаём переменную во время сборки
ENV VITE_API_URL=/api

RUN npm run build

# Этап 2 — запуск через nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]