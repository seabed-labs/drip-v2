package translator

import (
	"errors"
	"fmt"
	"path/filepath"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

type (
	config = postgres.Config
	Option func(*config)
)

func WithDatabaseName(name string) Option {
	return func(c *config) {
		c.DatabaseName = name
	}
}

func WithSchemaName(name string) Option {
	return func(c *config) {
		c.SchemaName = name
	}
}

func WithStatementTimeout(timeout time.Duration) Option {
	return func(c *config) {
		c.StatementTimeout = timeout
	}
}

func (t *Translator) Migrate(dirpath string, opts ...Option) error {
	var c config
	for _, opt := range opts {
		opt(&c)
	}

	driver, err := postgres.WithInstance(t.db, &c)
	if err != nil {
		return err
	}

	dirpath, err = filepath.Abs(dirpath)
	if err != nil {
		return fmt.Errorf("failed to get absolute filepath: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file:///%s", dirpath),
		"postgres",
		driver,
	)
	if err != nil {
		return err
	}

	t.log.Info("migrating database up")
	err = m.Up()
	if errors.Is(err, migrate.ErrNoChange) {
		t.log.Info("migration resulted in no change")
	} else if err != nil {
		return fmt.Errorf("migration failed: %w", err)
	} else {
		t.log.Info("successful migration")
	}

	return nil
}
