# Verified deployment — 31 October 2026

- Public website: http://54.146.216.76
- Docker Hub: https://hub.docker.com/r/annamalaikumar/portfolio-3d/tags
- Image: `annamalaikumar/portfolio-3d:1.0.0`
- Verified immutable digest: `sha256:f7715c22520387ddd53374112403ebbde7b49e1abb3d32041c1373316d8cc004`
- Existing EC2: `i-046c0a0af5b829c18` / MyPortfolio, us-east-1, account 371892604790.
- No additional EC2 instance, Elastic IP, IAM role, or security group was created. The unused CloudFormation template was not deployed.
- Remote Kubernetes: K3s v1.36.5+k3s1. Namespace: `portfolio`. App Deployment: `portfolio`. MongoDB StatefulSet: `mongo7`.
- Local test Kubernetes: kind cluster `portfolio-local`; kubeconfig is ignored at `deploy/.runtime/local-kubeconfig`.

## Completed verification

Application tests and production build passed. Docker image built and pushed; Docker Hub manifest/digest verified. Local Kubernetes end-to-end tests passed for page, health, contact save, WhatsApp link, and MongoDB persistence. Public EC2 tests passed: website, health endpoint, profile photo, résumé download, contact save, WhatsApp link, and database persistence. Each end-to-end test used two reserved example numbers; only those inserted test records were removed afterward. No WhatsApp messages were sent by these tests.

## MongoDB compatibility

The EC2 host runs kernel 7.0.0-1014-aws, which the MongoDB 8 image refuses to start on. EC2 therefore uses `k8s/mongo-compat.yaml`, a MongoDB 7 StatefulSet with its own fresh volume and the existing authenticated database secret. The failed MongoDB 8 StatefulSet is scaled to zero; its volume was not deleted or downgraded. Local Kubernetes continues to use its tested MongoDB 8 volume.

To rerun on the existing host after copying updated manifests into `/home/ubuntu/portfolio-deploy`:

```bash
MONGO_MANIFEST=k8s/mongo-compat.yaml MONGO_STATEFULSET=mongo7 bash /home/ubuntu/portfolio-deploy/bootstrap-existing.sh
sudo k3s kubectl -n portfolio get pods
sudo k3s kubectl -n portfolio logs deployment/portfolio
```

Public contact requests are stored on EC2 in `myportfolio.responses`, not in the separate Windows MongoDB Compass database. WhatsApp is a prefilled handoff link: the visitor still presses Send in WhatsApp.

## Remaining operational limitations

The endpoint is HTTP-only; configure a domain and trusted TLS certificate before collecting real visitor phone numbers. The public IP is the instance's current automatically assigned IP and may change after a stop/start; no Elastic IP was allocated. MongoDB storage is single-node local disk; configure backups before relying on it. The instance still consumes the user's existing AWS credits while running; no paid-plan upgrade was performed.

The temporary local port-forward used for tests can be restarted with:

```powershell
kubectl --kubeconfig deploy/.runtime/local-kubeconfig -n portfolio port-forward service/portfolio 18080:80 --address 127.0.0.1
```
