FROM node:20 AS build

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./

RUN npm install

COPY . .

RUN ng build

FROM node:18-alpine

RUN npm install -g http-server

WORKDIR /app

COPY --from=build /app/dist/queue-quick /app

EXPOSE 8080

CMD ["http-server", "/app", "-p", "8080"]
