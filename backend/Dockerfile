FROM golang:1.20 AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /pocketbase main.go api.go

FROM alpine:latest

# RUN apk add --no-cache ca-certificates

WORKDIR /root/

COPY --from=build /pocketbase .

EXPOSE 8090

CMD ["./pocketbase", "serve"]