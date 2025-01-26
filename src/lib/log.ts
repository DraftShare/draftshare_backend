import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";

// Определяем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к файлу логов
const logFile = path.join(__dirname, "logs", "app.log");
// const logFile = path.join('/usr/src/app/logs', 'app.log');

// Проверяем, существует ли директория `logs`, и создаем её, если нет
if (!fs.existsSync(path.dirname(logFile))) {
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
}

// Создаем поток записи в файл
const logStream = fs.createWriteStream(logFile, { flags: "a" });

// Функция логирования
export const log = (message: string) => {
  const timestamp = new Date().toISOString();
  logStream.write(`${timestamp} - ${message}\n`);
};




// log("Server started");

// // Логирование входящих запросов
// app.use((req, res, next) => {
//   log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

// // Логирование ошибок
// process.on("uncaughtException", (err) => {
//   log(`Uncaught Exception: ${err.message}`);
//   process.exit(1);
// });

// process.on("unhandledRejection", (reason, promise) => {
//   log(`Unhandled Rejection: ${reason}`);
// });