# GitHub Actions setup

The workflow in `.github/workflows/cicd.yml` runs on pushes to main, pull requests, and manual dispatch. Pull requests only test/build. On main it tests against a temporary MongoDB service, builds the production frontend, publishes the Docker image, and deploys the immutable image digest onto the existing EC2 K3s deployment. Missing secrets cause publishing/deployment to skip with a notice, so adding this workflow does not require sharing credentials immediately.

## Repository secrets

In GitHub, open Settings → Secrets and variables → Actions → New repository secret.

| Secret | Value |
| --- | --- |
| `DOCKERHUB_USERNAME` | `annamalaikumar` |
| `DOCKERHUB_TOKEN` | Docker Hub personal access token with read/write permission for `portfolio-3d` |
| `EC2_HOST` | `54.146.216.76` (update if the instance IP changes) |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_PRIVATE_KEY` | Entire existing HabitTracker-EC2-Key PEM contents; never commit this file |
| `EC2_SSH_KNOWN_HOSTS` | Verified SSH known-hosts entry for the EC2 host, including host, key type, and public host key |

The trusted host entry from the deployment verification is stored locally in `portfolio-3d/deploy/.runtime/known_hosts` in the original workspace. Copy that entry into the secret. Verify changes against the instance through a trusted channel; do not disable host-key checking or blindly trust an arbitrary new scan.

No AWS access keys or MongoDB passwords are needed in GitHub. Database credentials stay in the existing Kubernetes Secret on EC2. The deploy script updates only the portfolio Deployment image and site-origin configuration; it never recreates MongoDB or deletes contact records. If rollout or local health fails, it restores the previous image/origin and fails the workflow.

## SSH connectivity requirement

The current EC2 security group allows SSH from your IP and the AWS EC2 Instance Connect prefix list. That does **not** automatically allow a GitHub-hosted runner. Merely adding the six secrets is not enough if the runner cannot reach port 22.

Use a trusted self-hosted **Linux** runner on an already permitted network, or explicitly arrange narrowly scoped SSH connectivity from your chosen runner. To select a registered self-hosted runner, add repository variable `DEPLOY_RUNNER_LABELS` with JSON such as `["self-hosted","Linux","portfolio-deploy"]`. Assign those labels to the trusted runner. Do not expose SSH to the whole internet. The workflow will fail clearly on an unreachable SSH endpoint; it does not modify AWS firewall rules or create resources.

Optional repository variable `SITE_ORIGIN` sets the real public origin, e.g. `https://your-domain.example`. Otherwise the workflow uses `http://EC2_HOST`. HTTPS is not configured by this workflow.

## Run

After secrets and runner connectivity are ready: Actions → Portfolio CI/CD → Run workflow → main. Subsequent pushes to main run it automatically. Docker Hub receives a tag matching the Git commit SHA and `latest`; the EC2 deployment receives the exact build digest. The existing `1.0.0` tag is not overwritten.

The first commit can run CI without deployment secrets. Actual publishing/deployment cannot be verified until you provide the secrets and a reachable runner. GitHub Actions billing depends on your account, repository visibility, and runner usage; this workflow does not change your GitHub or AWS plan.
