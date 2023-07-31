#!/bin/bash

MIGRATIONS_DIR="modeler/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "$MIGRATIONS_DIR directory not found"
    exit 1
fi

if [ -z "$(ls -A $MIGRATIONS_DIR)" ]; then
    MIGRATION_NUMBER=1
else
    LAST_MIGRATION=$(ls $MIGRATIONS_DIR | grep -E '^[0-9]+_[a-zA-Z0-9_]+\.up\.sql$' | sort -n | tail -n 1)
    if [ -z "$LAST_MIGRATION" ]; then
        MIGRATION_NUMBER=1
    else
        MIGRATION_NUMBER=$(echo $LAST_MIGRATION | cut -d '_' -f1)
        MIGRATION_NUMBER=$((MIGRATION_NUMBER+1))
    fi
fi

if [ -z "$1" ]; then
    read -p "Enter the new migration name: " MIGRATION_NAME
else
    MIGRATION_NAME="$1"
    MIGRATION_NUMBER=${2:-$MIGRATION_NUMBER}
fi

if [ -z "$MIGRATION_NAME" ]; then
    echo "Usage: $0 <migration_name> [migration_number]"
    exit 1
fi

touch "$MIGRATIONS_DIR/$MIGRATION_NUMBER"_"$MIGRATION_NAME.up.sql"
touch "$MIGRATIONS_DIR/$MIGRATION_NUMBER"_"$MIGRATION_NAME.down.sql"
