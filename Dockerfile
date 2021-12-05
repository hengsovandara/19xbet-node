FROM node:14
WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
RUN apt-get update && apt-get install vim -y && apt-get install nmap -y
CMD yarn prod
EXPOSE 8080