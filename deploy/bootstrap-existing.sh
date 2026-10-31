#!/usr/bin/env bash
# Run only on the existing MyPortfolio Ubuntu instance after copying deploy/k8s.
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -f k8s/app.yaml ] || [ ! -f k8s/mongo.yaml ]; then
  echo 'Missing Kubernetes manifests'; exit 1
fi
if ! command -v k3s >/dev/null; then
  curl -fsSL https://get.k3s.io -o /tmp/portfolio-install-k3s.sh
  sudo env INSTALL_K3S_CHANNEL=stable INSTALL_K3S_EXEC='server --secrets-encryption' sh /tmp/portfolio-install-k3s.sh
fi
for attempt in $(seq 1 60); do
  if sudo k3s kubectl get nodes -o name 2>/dev/null | grep -q '^node/'; then break; fi
  sleep 2
done
sudo k3s kubectl wait --for=condition=Ready nodes --all --timeout=180s
sudo k3s kubectl create namespace portfolio --dry-run=client -o yaml | sudo k3s kubectl apply -f -
if ! sudo k3s kubectl -n portfolio get secret database >/dev/null 2>&1; then
  python3 - <<'PY' | sudo k3s kubectl apply -f -
import secrets,json
password=secrets.token_hex(24)
print(json.dumps({'apiVersion':'v1','kind':'Secret','metadata':{'name':'database','namespace':'portfolio'},'type':'Opaque','stringData':{'password':password,'uri':f'mongodb://portfolio:{password}@mongo:27017/myportfolio?authSource=admin'}}))
PY
fi
sudo k3s kubectl -n portfolio create configmap settings --from-literal=site-origin=http://54.146.216.76 --dry-run=client -o yaml | sudo k3s kubectl apply -f -
sudo k3s kubectl apply -f "${MONGO_MANIFEST:-k8s/mongo.yaml}"
sudo k3s kubectl -n portfolio rollout status "statefulset/${MONGO_STATEFULSET:-mongo}" --timeout=300s
sudo k3s kubectl apply -f k8s/app.yaml
sudo k3s kubectl -n portfolio rollout status deployment/portfolio --timeout=240s
curl --fail --retry 10 --retry-delay 3 http://127.0.0.1/api/health
echo 'Portfolio is ready at http://54.146.216.76 (HTTP only; configure TLS before collecting real visitor data).'
