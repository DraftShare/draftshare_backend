FROM node:lts-alpine

WORKDIR /app

# Устанавливаем зависимости Prisma
RUN apk add --no-cache openssl

# Копируем файлы зависимостей первыми для кэширования
COPY package.json package-lock.json ./
COPY prisma ./prisma/


RUN npm install
COPY . .
# Команда для запуска приложения с миграциями
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]