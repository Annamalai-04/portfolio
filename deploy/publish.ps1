param([string]$Tag = '1.0.0')
$ErrorActionPreference='Stop'
if($Tag -notmatch '^[a-zA-Z0-9_.-]+$'){throw 'Invalid image tag'}
$projectRoot=Split-Path $PSScriptRoot -Parent
$image="annamalaikumar/portfolio-3d:$Tag"
Push-Location $projectRoot
try {
  docker build --platform linux/amd64 -t $image .
  if($LASTEXITCODE -ne 0){throw 'Docker build failed'}
  docker push $image
  if($LASTEXITCODE -ne 0){throw 'Docker Hub push failed. Log in with docker login first.'}
} finally { Pop-Location }
