# Portfolio HTTPS

Live URL: https://annamalaidev.duckdns.org

Configured and verified on 1 November 2026 on existing instance
`i-046c0a0af5b829c18` (54.146.216.76), AWS account 371892604790, us-east-1.
No application source, database data, EC2 resources or security-group rules changed.

## Configuration

- K3s v1.36.5+k3s1, Traefik 3.7.13.
- cert-manager v1.21.3, installed from its official pinned release manifest.
- Staging HTTP-01 issuance succeeded before production issuance.
- Production Certificate `portfolio/portfolio-domain` is Ready=True.
- TLS secret: `portfolio/portfolio-domain-tls`; private key is never exported.
- Certificate identity: annamalaidev.duckdns.org; issuer: Let's Encrypt YR1.
- Certificate expires 30 January 2027 at 10:19:11 IST.
- Automatic renewal scheduled for 31 December 2026 at 10:19:11 IST
  (`2026-12-31T04:49:11Z`), 30 days before expiry. Future completed renewal has
  not yet been observed; cert-manager continuously reconciles the Certificate.
- Existing ingress `portfolio` now routes this domain on `websecure` using TLS.
- `portfolio-domain-http` applies a domain-only HTTPS redirect (verified 308).
- `portfolio-ip-http` preserves previous HTTP/IP access and localhost CI probes.
- HTTP-01 solver ingresses explicitly use Traefik's `web` entrypoint. Their
  specific challenge paths take precedence over the domain's `/` redirect.
- ConfigMap `portfolio/settings` and GitHub Actions variable `SITE_ORIGIN` now
  use `https://annamalaidev.duckdns.org`. One necessary rolling app restart
  refreshed its environment; the MongoDB pod was not restarted.

Backups made **before** changes on EC2:
`/home/ubuntu/portfolio-deploy/https-backup-20261101T054423Z/`.
They include ingress, services, deployments, StatefulSets, ConfigMaps, Traefik
and Helm configuration; secret metadata only. No password/private-key export.
Setup/verification files are under `/home/ubuntu/portfolio-deploy/https/`.

## Verification

- DNS A record resolves to 54.146.216.76.
- HTTP redirects to HTTPS; trusted HTTPS returns 200.
- OpenSSL verified certificate trust and hostname; Windows curl also trusted it.
- Public HTTPS page rendered all eight sections in headless Chrome with touch
  emulation and desktop layout, without bypassing certificate validation.
- HTTPS `/api/health` and localhost HTTP health checks returned `status: ok`.
- Invalid contact submission with the HTTPS Origin returned expected 400
  validation, proving it passed the Origin check without inserting a record.
- MongoDB authenticated ping returned `ok: 1`; active app, MongoDB, Traefik,
  cert-manager and cluster system pods healthy.

## Networking and remaining limitations

Existing security group `sg-04ae8b343249f2116` allows public TCP 80 and 443.
It does not expose 6443 or 27017. SSH has a pre-existing public `0.0.0.0/0`
rule alongside a specific-IP rule and AWS EC2 Instance Connect prefix list.
The owner explicitly chose to leave SSH unchanged to preserve the current
GitHub-hosted SSH deployment. Restrict SSH after establishing a trusted runner
or another deployment access method. No firewall rules were modified.

The EC2 address is not an allocated Elastic IP. If it changes after stop/start,
update DuckDNS and GitHub `EC2_HOST`; keep public 80 reachable for renewals.
The instance has 2 GB RAM; keep an eye on memory after adding cert-manager.

## Troubleshooting on EC2

```bash
sudo k3s kubectl -n portfolio get certificate,certificaterequest,order,challenge
sudo k3s kubectl -n portfolio describe certificate portfolio-domain
sudo k3s kubectl -n cert-manager get pods
sudo k3s kubectl -n cert-manager logs deployment/cert-manager --tail=100
sudo k3s kubectl -n portfolio get ingress
sudo k3s kubectl get pods -A
curl -I http://annamalaidev.duckdns.org
curl -I https://annamalaidev.duckdns.org
curl --fail https://annamalaidev.duckdns.org/api/health
bash /home/ubuntu/portfolio-deploy/https/verify.sh
```

Never print Kubernetes secret data. When checking a certificate, inspect only
the public served certificate with OpenSSL, not the TLS private key.

## Reapplying configuration

`prepare.sh` is the initial backup/install stage. It leaves an existing
cert-manager installation untouched. After inspecting compatibility and existing
resource names, apply `issuers.yaml`, wait for the staging issuer, then apply
`staging-certificate.yaml` and wait for Ready. Only then apply `certificate.yaml`
and wait for production Ready before running `enable.sh`. Run `verify.sh` last.

`enable.sh` is repeatable and only restarts the app if its origin needs changing.
Do not reapply the old catch-all ingress in `deploy/k8s/app.yaml` over the TLS
ingress; if bootstrap is used again, restore the HTTPS overlay afterwards.
Normal CI/CD changes the app image and origin, preserving these ingress resources.

Official references:
- https://cert-manager.io/docs/releases/
- https://cert-manager.io/docs/installation/kubectl/
- https://cert-manager.io/docs/configuration/acme/http01/
- https://cert-manager.io/docs/usage/certificate/
- https://doc.traefik.io/traefik/reference/routing-configuration/http/middlewares/redirectscheme/
