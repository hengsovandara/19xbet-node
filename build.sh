!#/bin/bash

git pull
cp docker-compose.yaml /etc/hasura/
docker system prune -f
docker build . -t node-api:latest
cd /etc/hasura
docker-compose down
docker-compose up -d



