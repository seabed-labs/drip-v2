HDI := $(shell docker run --net=host --rm codenvy/che-ip:4.7.2)

build: gen
	@echo "==== RUNNING BUILD ===="
	@docker build \
		-t dcaf-api \
		-f cmd/Dockerfile ./

run: build up
	@sleep 2
	@go run ./...

### Migrate ###
create-migration:
	@./scripts/create_migration_files.sh

migrate:
	@$(MAKE) -s up
	@sleep 2
	@$(MAKE) -s migrate-up
	@$(MAKE) -s migrate-down
	@$(MAKE) -s down


migrate-up: gen
	@echo "==== RUNNING DB MIGRATIONS (UP) ===="
	@docker run \
		--rm \
		--volume $(CURDIR)/modeler/migrations:/migrations \
		--add-host localhost:$(HDI) \
		migrate/migrate:v4.16.2 \
			-path=/migrations/ \
			-database postgres://docker:docker@localhost:5432/micro?sslmode=disable \
			up

migrate-down:
	@echo "==== RUNNING DB MIGRATIONS (DOWN) ===="
	@docker run \
		--rm \
		--volume $(CURDIR)/modeler/migrations:/migrations \
		--add-host localhost:$(HDI) \
		migrate/migrate:v4.16.2 \
			-path=/migrations/ \
			-database postgres://docker:docker@localhost:5432/micro?sslmode=disable \
			down -all

#### Code Gen ####
gen: gen-sql

gen-sql: sqlc
	@docker run --rm -v $(CURDIR):/src \
		-w /src/modeler \
		--user $(shell id -u):$(shell id -g) \
		dcaf-sqlc:1.16.0 sqlc generate

#### Code Lint ####
lint: lint-go lint-sql

lint-go:
	@echo "==== LINTING GO CODE ===="
	@docker run \
		--rm \
		--volume $(CURDIR):/mnt/api \
		--workdir /mnt/api \
		golangci/golangci-lint:v1.53.2 \
		golangci-lint run --config .golangci.yml -v

lint-sql:
	@echo "==== LINTING SQL FILES ===="
	@docker run \
		--rm \
		--volume $(CURDIR):/sql \
		--workdir /sql \
		sqlfluff/sqlfluff:2.1.1 \
		lint modeler/model.sql modeler/queries modeler/migrations

#### Docker ####
up: down
	@echo "==== BRINING UP APPLIANCES ===="
	@docker-compose up -d

down:
	@docker-compose down

sqlc:
	@docker build \
		-t dcaf-sqlc:1.16.0 \
		-f modeler/sqlc.Dockerfile ./


.PHONY: build
.PHONY: run
.PHONY: create-migration
.PHONY: migrate
.PHONY: migrate-up
.PHONY: migrate-down
.PHONY: gen
.PHONY: gen-sql
.PHONY: lint
.PHONY: lint-go
.PHONY: lint-sql
.PHONY: up
.PHONY: down
.PHONY: sqlc
