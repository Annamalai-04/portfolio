# Annamalai — Interactive 3D Portfolio

React + Vite portfolio with an interactive Three.js laptop, circular portrait, animated backgrounds, responsive navigation, skills, professional experience, education, and certifications. A Node.js API stores contact requests in MongoDB and provides a prefilled WhatsApp handoff link.

## Run locally

Requires Node.js 22+, npm, and MongoDB running locally.

```bash
npm ci
npm run server
```

In a second terminal:

```bash
npm run dev
```

Open the Local URL printed by Vite. Default database: `myportfolio.responses` on `127.0.0.1:27017`. Optional server settings are documented in [server/README.md](server/README.md); copy `server/.env.example` to the ignored `server/.env` if needed.

## Edit content

Update `src/data/personal.js`, `skills.js`, `experience.js`, and `projects.js`. Profile photo: `public/images/annamalai.jpg`. The supplied résumé is downloadable from `public/Annamalai_Selvakumar_Resume.docx`. Experience and education are based on the supplied résumé. Personal project case studies can be added to the empty projects array.

## Checks

```bash
npm test
npm run build
```

Set `TEST_MONGODB=1` to include the real MongoDB persistence test. Its reserved-number test record is removed afterward. `npm run preview` previews only the frontend; run the API separately for contacts.

## Docker and Kubernetes

[Deployment guide](deploy/README.md) · [Verified EC2 deployment](deploy/STATUS.md) · [CI/CD secrets and runner setup](deploy/CICD.md)

The Dockerfile serves the built frontend and API in one non-root Node container. MongoDB runs separately with authentication and persistent storage. Production needs a reverse proxy/ingress and a trusted HTTPS certificate. The existing EC2 site currently uses HTTP.

## GitHub Actions

`.github/workflows/cicd.yml` tests/builds pull requests. On main it publishes commit-tagged images to Docker Hub and deploys their exact digest to the existing EC2 K3s Deployment when the required secrets are available. Publishing/deployment are skipped until secrets are configured. See [the setup guide](deploy/CICD.md) for all six secrets and the SSH connectivity requirement. Database credentials remain on EC2 and contact records are preserved during application rollouts.
