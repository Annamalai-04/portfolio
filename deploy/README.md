# Deployment

Target: us-east-1, one EC2 instance, Elastic IP, single-node K3s Kubernetes. Docker Hub image: `annamalaikumar/portfolio-3d:1.0.0`. No deployment has been performed merely by adding these files.

## Container build

Dockerfile builds Vite, then runs the Node contact API and static website in one non-root container. No database or credentials are baked into the image. Public résumé/photo assets are part of the website image. Install Docker or build on a Linux host, then run `docker login` yourself. Publish with `./deploy/publish.ps1` from PowerShell. A successful image build and push must be verified before Kubernetes rollout; a Dockerfile alone is not a built image.

For local Compose testing, set `MONGO_PASSWORD` to a strong URL-safe password in your shell, then run `docker compose up --build`. Website: http://127.0.0.1:8080. MongoDB is authenticated and has no published port. This database is separate from your existing Windows MongoDB instance.

## AWS host

`ec2.yaml` is a CloudFormation template using your existing VPC and public subnet. It provisions an encrypted 30GB disk, a t3.medium by default, an Elastic IP, and an EC2 Systems Manager role. Inbound traffic is limited to web ports 80/443; no public SSH, MongoDB, or Kubernetes API. The subnet must route to an internet gateway. Resource creation incurs costs and requires budget approval before execution. An Elastic IP is billable even when idle. The role authorizes only SSM instance management, not account-wide administration.

K3s and Docker install at boot. Wait for cloud-init completion and a healthy Kubernetes node before deploying workloads. Use SSM, not public SSH, for administration.

## Kubernetes rollout

1. Build/push the image; use its immutable digest in `k8s/app.yaml` for the actual deployment.
2. Create the `portfolio` namespace.
3. Generate a strong URL-safe Mongo password. Create a Kubernetes secret `database` with keys `password` and `uri` (`mongodb://portfolio:PASSWORD@mongo:27017/myportfolio?authSource=admin`). Pass secrets via stdin or your secret manager; never commit them or place them in shell history.
4. Create ConfigMap `settings` with `site-origin` equal to the real website origin.
5. Apply `k8s/mongo.yaml`; wait for `mongo-0` readiness. Then apply `k8s/app.yaml` and wait for the portfolio deployment rollout.
6. Verify website, static assets, `/api/health`, and an actual contact submission. Check persistence in MongoDB; remove only the explicit test record afterward.

K3s supplies the Traefik ingress and local-path storage class. This setup has one instance and one MongoDB replica: it is not highly available. Local-path MongoDB storage lives on the instance disk, so instance termination can lose contact data. Configure off-instance backups before relying on it. This deployment does not migrate existing local Windows contacts.

The initial ingress manifest is HTTP-only. Before accepting visitor phone numbers publicly, configure a domain and trusted TLS certificate on Traefik (or terminate TLS at an approved AWS load balancer). Do not represent HTTP as secure or production-ready. No TLS or load-balancer costs are silently added.

## Validation

`npm test` and `npm run build` validate the app. Container runtime checks require Docker. AWS `validate-template` validates CloudFormation syntax, not actual provisioning or the bootstrap scripts. Kubernetes client dry-run validates manifest parsing only. Deployments must also be checked on the real cluster.
