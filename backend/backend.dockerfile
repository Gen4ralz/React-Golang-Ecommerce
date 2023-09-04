FROM golang:1.20-alpine as buidler

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN CGO_ENABLED=0 go build -o backendApp .

RUN chmod +x /app/backendApp

# build a tiny docker image
FROM alpine:latest

RUN mkdir /app

COPY --from=buidler /app/backendApp /app

CMD [ "/app/backendApp" ]