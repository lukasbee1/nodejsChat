FROM node:latest
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production --silent
COPY . .

EXPOSE 3001

RUN chmod +x ./wait-for-it.sh

CMD ["./wait-for-it.sh", "database:33060", "--", "node", "./src/socket_server.js"]

# RUN npm install --production --silent && npm cache clean --force
# WORKDIR /src
# COPY . /src/app