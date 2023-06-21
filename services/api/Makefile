HDI := $(shell docker run --net=host --rm codenvy/che-ip:4.7.2)

build:
	@echo "==== RUNNING BUILD ===="
	@docker build \
		--tag dcaf-api:latest \
		--file cmd/Dockerfile ./

run: build appliances
	@sleep 2
	@go run ./...

### Migrate ###
create-migration:
	@./scripts/create_migration_files.sh

migrate:
	@$(MAKE) -s appliances
	@sleep 2
	@$(MAKE) -s migrate-up
	@$(MAKE) -s migrate-down
	@$(MAKE) -s appliances-down


migrate-up: gen
	@echo "==== RUNNING DB MIGRATIONS (UP) ===="
	@docker run --rm \
		--volume $(CURDIR)/modeler/migrations:/migrations \
		--add-host localhost:$(HDI) \
		migrate/migrate:v4.16.2 \
			-path=/migrations/ \
			-database postgres://docker:docker@localhost:5432/micro?sslmode=disable \
			up

migrate-down:
	@echo "==== RUNNING DB MIGRATIONS (DOWN) ===="
	@docker run --rm \
		--volume $(CURDIR)/modeler/migrations:/migrations \
		--add-host localhost:$(HDI) \
		migrate/migrate:v4.16.2 \
			-path=/migrations/ \
			-database postgres://docker:docker@localhost:5432/micro?sslmode=disable \
			down -all

#### Code Gen ####
gen: gen-sql

gen-sql: sqlc
	@docker run --rm \
		--volume $(CURDIR):/src \
		--workdir /src/modeler \
		--user $(shell id -u):$(shell id -g) \
		dcaf-sqlc:1.18.0 \
			sqlc generate

#### Code Lint ####
lint: lint-go lint-sql

lint-go:
	@echo "==== LINTING GO FILES ===="
	@docker run --rm \
		--volume $(CURDIR):/src \
		--workdir /src \
		golangci/golangci-lint:v1.53.2 \
			golangci-lint run --config .golangci.yml --verbose

lint-sql:
	@echo "==== LINTING SQL FILES ===="
	@docker run --rm \
		--volume $(CURDIR):/src \
		--workdir /src/modeler \
		sqlfluff/sqlfluff:2.1.1 \
			lint model.sql queries migrations

#### Code Fix ####
lint-fix: fix-sql

fix-sql:
	@echo "==== FIXING SQL FILES ===="
	@docker run --rm \
		--volume $(CURDIR):/src \
		--workdir /src/modeler \
		--user $(shell id -u):$(shell id -g) \
		sqlfluff/sqlfluff:2.1.1 \
			fix model.sql queries migrations --force

#### Appliances ####
appliances: appliances-down appliances-up

appliances-up:
	@echo "==== BRINING UP APPLIANCES ===="
	@docker-compose up --detach

appliances-down:
	@docker-compose down

sqlc:
	@docker build \
		--tag dcaf-sqlc:1.18.0 \
		--file modeler/sqlc.Dockerfile ./


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
.PHONY: lint-fix
.PHONY: fix-sql
.PHONY: appliances
.PHONY: appliances-up
.PHONY: appliances-down
.PHONY: sqlc
