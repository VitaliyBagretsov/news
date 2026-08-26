#!/usr/bin/env bash

set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
readonly ENV_FILE="${PROJECT_DIR}/.env.prod"
readonly COMPOSE_FILE="${PROJECT_DIR}/docker-compose.prod.yml"
readonly EXPECTED_BRANCH="main"

cd "${PROJECT_DIR}"

for command in git docker awk mktemp; do
  if ! command -v "${command}" >/dev/null 2>&1; then
    echo "Required command is not installed: ${command}" >&2
    exit 1
  fi
done

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}. Create it from .env.prod.example first." >&2
  exit 1
fi

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
image="news-backend:${commit_sha}"

echo "Building ${image}..."
docker build --tag "${image}" ./backend

previous_image="$(awk -F= '$1 == "NEWS_BACKEND_IMAGE" { print substr($0, index($0, "=") + 1); exit }' "${ENV_FILE}")"
temporary_env="$(mktemp "${ENV_FILE}.tmp.XXXXXX")"
trap 'rm -f "${temporary_env}"' EXIT

umask 077
awk -v image="${image}" '
  BEGIN { updated = 0 }
  /^NEWS_BACKEND_IMAGE=/ {
    print "NEWS_BACKEND_IMAGE=" image
    updated = 1
    next
  }
  { print }
  END {
    if (!updated) {
      print "NEWS_BACKEND_IMAGE=" image
    }
  }
' "${ENV_FILE}" >"${temporary_env}"

chmod 600 "${temporary_env}"
mv "${temporary_env}" "${ENV_FILE}"

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

  if [[ -n "${previous_image}" && "${previous_image}" != "${image}" ]]; then
    echo "Restoring previous image ${previous_image}..." >&2
    sed -i.bak "s|^NEWS_BACKEND_IMAGE=.*|NEWS_BACKEND_IMAGE=${previous_image}|" "${ENV_FILE}"
    rm -f "${ENV_FILE}.bak"
    docker compose \
      --env-file "${ENV_FILE}" \
      -f "${COMPOSE_FILE}" \
      up -d --no-build --wait --wait-timeout 180
  fi

  exit 1
fi

echo "Deployment completed: ${image}"
docker compose \
  --env-file "${ENV_FILE}" \
  -f "${COMPOSE_FILE}" \
  ps

