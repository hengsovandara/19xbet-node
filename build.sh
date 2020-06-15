!#/bin/bash

git pull
docker system prune -f
docker build . -t node-api:latest
cd /etc/hasura
docker-compose down
docker-compose up -d



