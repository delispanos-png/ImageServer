#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="${ROOT_DIR}/frontend"
PORTAL_BUILD_DIR="/home/imageuser/cms-portal-build-next"
PORTAL_DIST_DIR="/home/imageuser/cms-portal-dist"

NODE_BIN="${NODE_BIN:-}"
if [[ -z "${NODE_BIN}" ]]; then
  NODE_BIN="$(find /home/imageuser/.vscode-server /home/imageuser/.antigravity-server -type f -name node 2>/dev/null | head -n 1)"
fi

if [[ -z "${NODE_BIN}" || ! -x "${NODE_BIN}" ]]; then
  echo "node binary not found"
  exit 1
fi

cd "${FRONTEND_DIR}"
rm -rf "${PORTAL_BUILD_DIR}"
"${NODE_BIN}" node_modules/typescript/bin/tsc
"${NODE_BIN}" node_modules/vite/bin/vite.js build --config vite.portal.config.ts --outDir "${PORTAL_BUILD_DIR}"
rsync -a --delete "${PORTAL_BUILD_DIR}/" "${PORTAL_DIST_DIR}/"

if [[ -f "${PORTAL_DIST_DIR}/portal.html" ]]; then
  cp "${PORTAL_DIST_DIR}/portal.html" "${PORTAL_DIST_DIR}/index.html"
fi

echo "customer portal build deployed to ${PORTAL_DIST_DIR}"
