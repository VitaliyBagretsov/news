#!/usr/bin/env bash

set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
readonly ENV_FILE="${1:-${PROJECT_DIR}/.env}"
readonly COMPOSE_FILE="${2:-${PROJECT_DIR}/docker-compose.yml}"
readonly SQL_FILE="${PROJECT_DIR}/docker/postgres/init/04-create-parser-config.sql"

docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up -d --wait postgres
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T postgres \
  sh -c 'psql --set ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <"${SQL_FILE}"

echo "Database schema is up to date."
