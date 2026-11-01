#!/usr/bin/env bash
set -euo pipefail
domain=annamalaidev.duckdns.org
k() { sudo k3s kubectl "$@"; }
echo 'DNS:'
getent ahostsv4 "$domain" | head -3
echo 'HTTP redirect:'
curl --fail --silent --show-error --head "http://$domain/"
echo 'Trusted HTTPS and API:'
curl --fail --silent --show-error --head "https://$domain/"
curl --fail --silent --show-error "https://$domain/api/health"
echo
echo 'Certificate identity, issuer and validity (public certificate only):'
openssl s_client -connect "$domain:443" -servername "$domain" -verify_hostname "$domain" -verify_return_error </dev/null 2>/dev/null |
  openssl x509 -noout -subject -issuer -dates -ext subjectAltName
echo 'HTTPS-origin contact validation (invalid phone, no record is inserted):'
status=$(curl --silent --show-error --output /tmp/portfolio-https-validation.json --write-out '%{http_code}' \
  -H "Origin: https://$domain" -H 'Content-Type: application/json' \
  --data '{"reason":"others","mobile":"invalid","whatsapp":false}' "https://$domain/api/contact")
cat /tmp/portfolio-https-validation.json
echo
test "$status" = 400
echo 'Local deployment health route:'
curl --fail --silent --show-error http://127.0.0.1/api/health
echo
echo 'MongoDB ping (uses existing in-pod credentials without displaying them):'
k -n portfolio exec mongo7-0 -- sh -c 'mongosh --quiet -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --eval "JSON.stringify(db.adminCommand({ping:1}))"'
echo 'Certificate/renewal schedule:'
k -n portfolio get certificate portfolio-domain -o jsonpath='{.status.conditions}{"\nExpires: "}{.status.notAfter}{"\nRenews: "}{.status.renewalTime}{"\n"}'
echo 'Pod status:'
k get pods -A
k -n portfolio get ingress
