FROM golang:1.20.4-bullseye as builder

WORKDIR /api

COPY . .
RUN go mod download
RUN go install ./...
RUN go build -o ./api ./cmd/main.go
RUN chmod +x ./api


FROM debian:bullseye-slim

WORKDIR /

COPY --from=builder /api/api ./api
COPY --from=builder /api/config ./config
COPY --from=builder /api/modeler/migrations ./modeler/migrations
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

EXPOSE 20000

ENTRYPOINT ["./api"]
