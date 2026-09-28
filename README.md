# Field Notes: Event Registration

A small event registration service for practicing source control, Jenkins CI, Docker, and Kubernetes. The app uses only Node.js built-ins, so it is quick to run and easy to inspect.

## Run locally

Requires Node.js 18 or newer.

```bash
npm start
```

Open http://localhost:3000. Registrations are stored in memory and are lost when the process stops.

## Project exercises

### 1. Registration form

The browser UI lives in `public/`; `POST /api/register` validates a name, email, and attendance type. `GET /health` is available for automated checks and orchestrators.

### 2-3. Git and GitHub practice

```bash
git init
git add .
git commit -m "Build event registration exercise"
git branch -M main
git remote add origin https://github.com/<account>/<repository>.git
git push -u origin main
git log --oneline --decorate --graph --all
git status
```

Try a change on a feature branch, push it, and open a pull request:

```bash
git switch -c improve-confirmation
git add public/
git commit -m "Improve confirmation message"
git push -u origin improve-confirmation
```

### 4-5. Jenkins CI

Create a Pipeline job in Jenkins pointing to this repository. The included `Jenkinsfile` runs syntax checks, starts the service, calls `/health`, and stops it. A GitHub webhook can trigger the job on every push.

### 6-7. Docker

```bash
docker build -t event-registration:local .
docker run --rm -p 3000:3000 event-registration:local
```

Or use Compose:

```bash
docker compose up --build
docker compose down
```

### 8-9. Kubernetes

With a local cluster such as Docker Desktop Kubernetes or Minikube:

```bash
docker build -t event-registration:local .
kubectl apply -f k8s/
kubectl get pods,services
kubectl port-forward service/event-registration 3000:80
```

For Minikube, make the image available with `minikube image load event-registration:local`. Remove the exercise resources with `kubectl delete -f k8s/`.

## API example

```bash
curl -i http://localhost:3000/health
curl -i -X POST http://localhost:3000/api/register \
	-H 'Content-Type: application/json' \
	-d '{"name":"Ada Lovelace","email":"ada@example.com","attendance":"in-person"}'
```