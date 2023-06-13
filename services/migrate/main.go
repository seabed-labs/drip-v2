package main

import (
	"errors"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/joho/godotenv"
	"log"
	"os"
	"strings"

	"github.com/jmoiron/sqlx"
	// Needed for loading drivers
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func main() {
	godotenv.Load()
	databases := strings.Split(os.Getenv("DATABASES"), ",")
	log.Printf("databases %s", databases)
	for _, database := range databases {
		if database == "" {
			continue
		}
		log.Printf("migrating db %s", database)
		if err := migrateDatabase(database); err != nil {
			log.Printf("err migrating db %s with err %w", database, err)
		}
	}
}

func migrateDatabase(dbName string) error {
	connectionUrl := getDBConnectionFromEnv(dbName)
	db, err := sqlx.Connect("postgres", connectionUrl)
	if err != nil {
		log.Printf("failed to connect to db, err %w", err)
		return err
	}
	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping db, err %w", err)
		return err
	}
	driver, err := postgres.WithInstance(db.DB, &postgres.Config{DatabaseName: dbName})
	if err != nil {
		log.Printf("failed to get db driver, err %w", err)
		return err
	}
	m, err := migrate.NewWithDatabaseInstance(
		// file://path/to/directory
		fmt.Sprintf("file://%s", getMigrationDir(dbName)),
		dbName, driver)
	if err != nil {
		log.Printf("failed to apply migrations, dir %s, err %w", err, getMigrationDir(dbName))
		return err
	}
	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		log.Printf("failed to sync db, err %w", err)
		return err
	}
	version, _, err := m.Version()
	log.Printf("migrated to version %s", version)
	return err
}

func getMigrationDir(dbName string) string {
	return fmt.Sprintf("./migrations/%s", dbName)
}

func getDBConnectionFromEnv(dbName string) string {
	connectionUrl := os.Getenv(fmt.Sprintf("%s_CONNECTION_URL", strings.ToUpper(dbName)))
	if connectionUrl != "" {
		return connectionUrl
	}
	host := os.Getenv(fmt.Sprintf("%s_HOST", strings.ToUpper(dbName)))
	port := os.Getenv(fmt.Sprintf("%s_PORT", strings.ToUpper(dbName)))
	user := os.Getenv(fmt.Sprintf("%s_USER", strings.ToUpper(dbName)))
	password := os.Getenv(fmt.Sprintf("%s_PASSWORD", strings.ToUpper(dbName)))
	return fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host,
		port,
		user,
		password,
		dbName)
}
