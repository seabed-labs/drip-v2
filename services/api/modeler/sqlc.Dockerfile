FROM golang:1.20-bullseye

RUN go install github.com/kyleconroy/sqlc/cmd/sqlc@v1.16.0
