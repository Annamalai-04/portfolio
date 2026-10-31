param([string]$Image='annamalaikumar/portfolio-3d:1.0.0')
$ErrorActionPreference='Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
 $config='deploy/.runtime/local-kubeconfig'
 function Invoke-Kube { & kubectl --kubeconfig $config @args; if($LASTEXITCODE -ne 0){throw 'kubectl failed'} }
 Invoke-Kube create namespace portfolio --dry-run=client -o yaml | & kubectl --kubeconfig $config apply -f -
 if($LASTEXITCODE -ne 0){throw 'Namespace creation failed'}
 $existing=& kubectl --kubeconfig $config -n portfolio get secret database --ignore-not-found -o name
 if(!$existing){
  $password=[Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(24)).ToLowerInvariant()
  $secret=@{apiVersion='v1';kind='Secret';metadata=@{name='database';namespace='portfolio'};type='Opaque';stringData=@{password=$password;uri="mongodb://portfolio:$password@mongo:27017/myportfolio?authSource=admin"}}
  $secret | ConvertTo-Json -Depth 8 | & kubectl --kubeconfig $config apply -f -
  if($LASTEXITCODE -ne 0){throw 'Secret creation failed'}
 }
 Invoke-Kube -n portfolio create configmap settings --from-literal=site-origin=http://127.0.0.1:18080 --dry-run=client -o yaml | & kubectl --kubeconfig $config apply -f -
 Invoke-Kube apply -f deploy/k8s/mongo.yaml
 Invoke-Kube -n portfolio rollout status statefulset/mongo --timeout=240s
 Invoke-Kube apply -f deploy/k8s/app.yaml
 Invoke-Kube -n portfolio set image deployment/portfolio "app=$Image"
 Invoke-Kube -n portfolio rollout status deployment/portfolio --timeout=240s
} finally { Pop-Location }
