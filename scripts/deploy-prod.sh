#!/usr/bin/env bash

set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
readonly ENV_FILE="${PROJECT_DIR}/.env.prod"
readonly COMPOSE_FILE="${PROJECT_DIR}/docker-compose.prod.yml"
readonly EXPECTED_BRANCH="main"

cd "${PROJECT_DIR}"

for command in git docker awk grep mktemp; do
  if ! command -v "${command}" >/dev/null 2>&1; then
    echo "Required command is not installed: ${command}" >&2
    exit 1
  fi
done

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}. Create it from .env.prod.example first." >&2
  exit 1
fi

for variable in BACKEND_PORT VITE_API_URL; do
  if ! grep -q "^${variable}=" "${ENV_FILE}"; then
    echo "${variable} is missing from ${ENV_FILE}." >&2
    exit 1
  fi
done

current_branch="$(git branch --show-current)"
if [[ "${current_branch}" != "${EXPECTED_BRANCH}" ]]; then
  echo "Production deployment must run from '${EXPECTED_BRANCH}', current branch is '${current_branch}'." >&2
  exit 1
fi

if [[ -n "$(git status --short --untracked-files=no)" ]]; then
  echo "Tracked files contain local changes. Commit or restore them before deployment." >&2
  git status --short
  exit 1
fi

echo "Updating ${EXPECTED_BRANCH} from origin..."
git pull --ff-only origin "${EXPECTED_BRANCH}"

commit_sha="$(git rev-parse --short=12 HEAD)"
backend_image="news-backend:${commit_sha}"
frontend_image="news-frontend:${commit_sha}"
vite_api_url="$(awk -F= '$1 == "VITE_API_URL" { print substr($0, index($0, "=") + 1); exit }' "${ENV_FILE}")"
gateway_network="$(awk -F= '$1 == "GATEWAY_NETWORK" { print substr($0, index($0, "=") + 1); exit }' "${ENV_FILE}")"
gateway_network="${gateway_network:-gateway}"

echo "Building ${backend_image}..."
docker build --tag "${backend_image}" ./backend

echo "Building ${frontend_image}..."
docker build \
  --build-arg VITE_BASE_PATH=/news/ \
  --build-arg "VITE_API_URL=${vite_api_url}" \
  --tag "${frontend_image}" \
  ./frontend

previous_backend_image="$(awk -F= '$1 == "NEWS_BACKEND_IMAGE" { print substr($0, index($0, "=") + 1); exit }' "${ENV_FILE}")"
previous_frontend_image="$(awk -F= '$1 == "NEWS_FRONTEND_IMAGE" { print substr($0, index($0, "=") + 1); exit }' "${ENV_FILE}")"
temporary_env="$(mktemp "${ENV_FILE}.tmp.XXXXXX")"
trap 'rm -f "${temporary_env}"' EXIT

umask 077
awk \
  -v backend_image="${backend_image}" \
  -v frontend_image="${frontend_image}" \
  -v gateway_network="${gateway_network}" '
  BEGIN { backend_updated = 0; frontend_updated = 0; network_updated = 0 }
  /^NEWS_BACKEND_IMAGE=/ {
    print "NEWS_BACKEND_IMAGE=" backend_image
    backend_updated = 1
    next
  }
  /^NEWS_FRONTEND_IMAGE=/ {
    print "NEWS_FRONTEND_IMAGE=" frontend_image
    frontend_updated = 1
    next
  }
  /^GATEWAY_NETWORK=/ {
    print "GATEWAY_NETWORK=" gateway_network
    network_updated = 1
    next
  }
  { print }
  END {
    if (!backend_updated) print "NEWS_BACKEND_IMAGE=" backend_image
    if (!frontend_updated) print "NEWS_FRONTEND_IMAGE=" frontend_image
    if (!network_updated) print "GATEWAY_NETWORK=" gateway_network
  }
' "${ENV_FILE}" >"${temporary_env}"

chmod 600 "${temporary_env}"
mv "${temporary_env}" "${ENV_FILE}"

if ! docker network inspect "${gateway_network}" >/dev/null 2>&1; then
  echo "Creating shared proxy network ${gateway_network}..."
  docker network create "${gateway_network}" >/dev/null
fi

echo "Validating production Compose configuration..."
docker compose \
  --env-file "${ENV_FILE}" \
  -f "${COMPOSE_FILE}" \
  config --quiet

echo "Starting production services and waiting for healthchecks..."
if ! docker compose \
  --env-file "${ENV_FILE}" \
  -f "${COMPOSE_FILE}" \
  up -d --no-build --wait --wait-timeout 180; then
  echo "Deployment failed." >&2

  if [[ -n "${previous_backend_image}" && "${previous_backend_image}" != "${backend_image}" ]]; then
    echo "Restoring previous backend image ${previous_backend_image}..." >&2
    sed -i.bak "s|^NEWS_BACKEND_IMAGE=.*|NEWS_BACKEND_IMAGE=${previous_backend_image}|" "${ENV_FILE}"
    rm -f "${ENV_FILE}.bak"
  fi

  if [[ -n "${previous_frontend_image}" && "${previous_frontend_image}" != "${frontend_image}" ]]; then
    echo "Restoring previous frontend image ${previous_frontend_image}..." >&2
    sed -i.bak "s|^NEWS_FRONTEND_IMAGE=.*|NEWS_FRONTEND_IMAGE=${previous_frontend_image}|" "${ENV_FILE}"
    rm -f "${ENV_FILE}.bak"
  fi

  if [[ -n "${previous_backend_image}" || -n "${previous_frontend_image}" ]]; then
    docker compose \
      --env-file "${ENV_FILE}" \
      -f "${COMPOSE_FILE}" \
      up -d --no-build --wait --wait-timeout 180
  fi

  exit 1
fi

echo "Deployment completed: ${backend_image}, ${frontend_image}"
docker compose \
  --env-file "${ENV_FILE}" \
  -f "${COMPOSE_FILE}" \
  ps
