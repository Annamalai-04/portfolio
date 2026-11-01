#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /home/ubuntu/portfolio-deploy/https
k() { sudo k3s kubectl "$@"; }
backup="/home/ubuntu/portfolio-deploy/https-backup-$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -m 700 "$backup"
k -n portfolio get ingress,service,deployment,statefulset,configmap -o yaml > "$backup/portfolio.yaml"
k -n portfolio get ingress portfolio -o yaml > "$backup/ingress.yaml"
k -n portfolio get configmap settings -o yaml > "$backup/settings.yaml"
k -n kube-system get deployment/traefik service/traefik -o yaml > "$backup/traefik.yaml"
k -n kube-system get helmchart,helmchartconfig -o yaml > "$backup/traefik-helm.yaml"
# Secret metadata only; database/password/private key values are never exported.
k -n portfolio get secrets > "$backup/secret-metadata.txt"
printf 'Configuration backup: %s\n' "$backup"
k version -o json
if ! k get namespace cert-manager >/dev/null 2>&1; then
  curl --fail --location --retry 3 https://github.com/cert-manager/cert-manager/releases/download/v1.21.3/cert-manager.yaml -o cert-manager-v1.21.3.yaml
  k apply -f cert-manager-v1.21.3.yaml
else
  echo 'cert-manager namespace already exists; inspect its version before any upgrade.'
fi
for component in cert-manager cert-manager-cainjector cert-manager-webhook; do
  k -n cert-manager rollout status "deployment/$component" --timeout=180s
done
k -n cert-manager get pods
