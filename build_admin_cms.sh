#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="${ROOT_DIR}/frontend"
ADMIN_BUILD_DIR="/home/imageuser/cms-admin-build-next"
ADMIN_DIST_DIR="/home/imageuser/cms-admin-dist"

NODE_BIN="${NODE_BIN:-}"
if [[ -z "${NODE_BIN}" ]]; then
  NODE_BIN="$(find /home/imageuser/.vscode-server /home/imageuser/.antigravity-server -type f -name node 2>/dev/null | head -n 1)"
fi

if [[ -z "${NODE_BIN}" || ! -x "${NODE_BIN}" ]]; then
  echo "node binary not found"
  exit 1
fi

cd "${FRONTEND_DIR}"
rm -rf "${ADMIN_BUILD_DIR}"
"${NODE_BIN}" node_modules/typescript/bin/tsc
"${NODE_BIN}" node_modules/vite/bin/vite.js build --config vite.config.ts --outDir "${ADMIN_BUILD_DIR}"
rsync -a --delete "${ADMIN_BUILD_DIR}/" "${ADMIN_DIST_DIR}/"

echo "admin build deployed to ${ADMIN_DIST_DIR}"
