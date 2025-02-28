#!/bin/bash

MONGO_PORTS=(27021 27022 27023)

echo "🛑 Останавливаем MongoDB Replica Set плавно..."

# 1. Определяем текущий PRIMARY
PRIMARY_PORT=""
for port in "${MONGO_PORTS[@]}"; do
  ROLE=$(mongosh --quiet --port "$port" --eval "rs.isMaster().ismaster")
  if [[ "$ROLE" == "true" ]]; then
    PRIMARY_PORT=$port
    break
  fi
done

# 2. Завершаем все SECONDARY узлы
for port in "${MONGO_PORTS[@]}"; do
  if [[ "$port" != "$PRIMARY_PORT" ]]; then
    echo "⏳ Завершаем SECONDARY MongoDB на порту $port..."
    mongosh --port "$port" --eval "db.adminCommand({ shutdown: 1 })" --quiet || echo "⚠️ Ошибка при завершении на порту $port"
    sleep 2
  fi
done

# 3. Завершаем PRIMARY с принудительным завершением (force: true)
if [[ -n "$PRIMARY_PORT" ]]; then
  echo "⏳ Завершаем PRIMARY MongoDB на порту $PRIMARY_PORT..."
  mongosh --port "$PRIMARY_PORT" --eval "db.adminCommand({ shutdown: 1, force: true })" --quiet || echo "⚠️ Ошибка при завершении PRIMARY"
  sleep 2
fi

# 4. Финальная проверка
PIDS=$(pgrep -f mongod)
if [[ -z "$PIDS" ]]; then
  echo "✅ Все узлы MongoDB остановлены корректно."
else
  echo "❌ Не удалось завершить некоторые процессы. Проверьте вручную."
fi