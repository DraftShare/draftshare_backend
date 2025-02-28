#!/bin/bash

REPLICA_SET_NAME="rs0"
MONGO_PORTS=(27021 27022 27023)
DB_PATHS=("$HOME/mongo/data/db01" "$HOME/mongo/data/db02" "$HOME/mongo/data/db03")

# Функция для запуска MongoDB узлов
start_mongo_instances() {
  for i in "${!MONGO_PORTS[@]}"; do
    mkdir -p "${DB_PATHS[i]}"
    mongod --port "${MONGO_PORTS[i]}" --dbpath "${DB_PATHS[i]}" --replSet "$REPLICA_SET_NAME" --fork --logpath "${DB_PATHS[i]}/mongod.log"
  done
}

# Функция для инициализации Replica Set
initiate_replica_set() {
  mongosh --port "${MONGO_PORTS[0]}" --eval "
    rs.initiate({
      _id: '$REPLICA_SET_NAME',
      members: [
        { _id: 0, host: 'localhost:${MONGO_PORTS[0]}' },
        { _id: 1, host: 'localhost:${MONGO_PORTS[1]}' },
        { _id: 2, host: 'localhost:${MONGO_PORTS[2]}' }
      ]
    });
  "
}

# Запускаем MongoDB
echo "Запуск MongoDB Replica Set..."
start_mongo_instances
sleep 5

# Инициализируем Replica Set
echo "Инициализация Replica Set..."
initiate_replica_set
sleep 10

# Убеждаемся, что MongoDB готов
until mongosh --port "${MONGO_PORTS[0]}" --eval "db.runCommand({ isMaster: 1 })" | grep -q "ismaster"; do
  echo "Ожидание готовности MongoDB..."
  sleep 2
done

echo "MongoDB Replica Set готов!"