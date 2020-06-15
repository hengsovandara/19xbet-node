FROM node:10
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
RUN apt-get update && apt-get install vim -y && apt-get install nmap -y
CMD yarn start
EXPOSE 8080