#!/usr/bin/env bash
set -euo pipefail
image="${1:?Pass immutable Docker image reference}"
origin="${2:?Pass website origin}"
[[ "$image" =~ ^annamalaikumar/portfolio-3d@sha256:[a-f0-9]{64}$ ]] || { echo 'Invalid image'; exit 1; }
[[ "$origin" =~ ^https?://[a-zA-Z0-9.-]+(:[0-9]+)?$ ]] || { echo 'Invalid site origin'; exit 1; }
command -v k3s >/dev/null || { echo 'K3s must already be installed'; exit 1; }
sudo k3s kubectl -n portfolio get deployment portfolio >/dev/null
sudo k3s kubectl -n portfolio get secret database >/dev/null
previous=$(sudo k3s kubectl -n portfolio get deployment portfolio -o jsonpath='{.spec.template.spec.containers[0].image}')
previous_origin=$(sudo k3s kubectl -n portfolio get configmap settings -o jsonpath='{.data.site-origin}')
rollback(){
  echo 'Rollout failed; restoring previous image and origin.'
  sudo k3s kubectl -n portfolio create configmap settings --from-literal="site-origin=$previous_origin" --dry-run=client -o yaml | sudo k3s kubectl apply -f -
  sudo k3s kubectl -n portfolio set image deployment/portfolio "app=$previous"
  sudo k3s kubectl -n portfolio rollout status deployment/portfolio --timeout=240s || true
}
sudo k3s kubectl -n portfolio create configmap settings --from-literal="site-origin=$origin" --dry-run=client -o yaml | sudo k3s kubectl apply -f -
sudo k3s kubectl -n portfolio set image deployment/portfolio "app=$image"
if ! sudo k3s kubectl -n portfolio rollout status deployment/portfolio --timeout=300s; then rollback; exit 1; fi
if ! curl --fail --retry 10 --retry-delay 3 http://127.0.0.1/api/health; then rollback; exit 1; fi
echo 'Deployment healthy. MongoDB resources and contact records were preserved.'
