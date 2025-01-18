# Используем официальный образ Node.js для приложения
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы приложения
COPY . .

# Компилируем TypeScript (если нужно)
# RUN npm run build

# Указываем порт, который будет слушать приложение
EXPOSE 8081

# Запуск приложения
CMD ["npm", "run", "dev"]
