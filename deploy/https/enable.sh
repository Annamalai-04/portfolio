#!/usr/bin/env bash
set -euo pipefail
cd /home/ubuntu/portfolio-deploy/https
k() { sudo k3s kubectl "$@"; }
k -n portfolio wait --for=condition=Ready certificate/portfolio-domain --timeout=30s
k apply --dry-run=server -f ingress.yaml
k -n portfolio patch ingress portfolio --type=merge --patch-file enable-ingress-patch.json --dry-run=server >/dev/null
# Preserve the old HTTP/IP route for localhost probes and existing CI checks.
awk '/^---/{exit} {print}' ingress.yaml | k apply -f -
k -n portfolio patch ingress portfolio --type=merge --patch-file enable-ingress-patch.json
k apply -f ingress.yaml
curl --fail --retry 10 --retry-all-errors --retry-delay 2 https://annamalaidev.duckdns.org/api/health
origin=$(k -n portfolio get configmap settings -o jsonpath='{.data.site-origin}')
if [ "$origin" != 'https://annamalaidev.duckdns.org' ]; then
  k -n portfolio patch configmap settings --type=merge --patch-file origin-patch.json
  # Environment variables from ConfigMaps refresh only when the pod restarts.
  k -n portfolio rollout restart deployment/portfolio
  k -n portfolio rollout status deployment/portfolio --timeout=180s
fi
k -n portfolio get pods,ingress,certificate
