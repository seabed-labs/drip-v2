FROM golang:1.20.4-bullseye as builder

WORKDIR /cache/api

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .
RUN go install ./...


FROM debian:bullseye-slim

WORKDIR /app

COPY --from=builder /cache/api .
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

ENTRYPOINT ["./api"]
