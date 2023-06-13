## Migrate

This is a service to extract the shared db migrations between the indexer/api services 
as well as the shared local db via docker-compose.

```bash
cp .env.txt .env
docker-compose --file .docker-compose.yaml up --remove-orphans -d
go run main.go
```

