# Task Pair Programming

Contexte global de la session
L’objectif est de construire, en pair-programming, une petite application web complète afin de démontrer un cycle de développement moderne de bout en bout.
L’application sera composée d’un frontend React, d’une API backend en Python/FastAPI et d’une base de données PostgreSQL. Elle permettra de gérer des tâches ou des tickets simples : consulter une liste, créer un élément et mettre à jour son statut.
Le projet doit être créé dans un monorepo afin de centraliser le frontend, le backend, les tests E2E, l’infrastructure et les pipelines CI/CD.
L’objectif ne se limite pas au développement fonctionnel : il faut aussi appliquer les bonnes pratiques de qualité, sécurité, revue de code et déploiement.




Pair-Programming Checklist
1. Project setup
    Create a GitHub repository
    Create a monorepo structure:
    frontend/ — React + TypeScript
    backend/ — Python FastAPI
    e2e/ — Playwright tests
    Add a clear README.md
    Add .gitignore and .env.example
2. Backend — FastAPI
    Create FastAPI project
    Add GET /health
    Create a static list of tasks in Python
    Add APIs:
    GET /tasks
    POST /tasks
    PATCH /tasks/{id}
    DELETE /tasks/{id}
    Add simple unit tests with pytest
3. Frontend — React
    Create React + TypeScript application
    Display the task list
    Add a form to create a task
    Add buttons to update status and delete a task
    Connect frontend to FastAPI
    Add one unit test with Vitest
4. E2E test
  Install Playwright
  Create one scenario:
  Open application
  Create a task
  Verify it appears in the list
  Change its status
5. Docker
    Create a Dockerfile for FastAPI
    Use a non-root user
    Add .dockerignore
    Build and run the backend image locally
6. Git and code review
  Protect main
  Create a feature branch: feature/task-management
  feature/T-123-create-user-list
  bugfix/….
  hotfix/..
  Create a Pull Request
  Request review
  Merge only when tests pass
7. CI — GitHub Actions
  Run on every Pull Request:
  Backend tests
  Frontend tests
  Frontend build
  Docker image build
  Run Trivy Docker security scan
  Block merge if CI fails
8. CD — GCP
  Deploy React frontend to Firebase Hosting
  Deploy FastAPI backend to Cloud Run
  Configure frontend API URL with an environment variable
  Add Cloud Run URL to FastAPI CORS
  Deploy automatically after merge to main
  Run a smoke test on /health
Final check
  Frontend works locally
  API works locally
  Tests pass
  CI passes on Pull Request
  Frontend is live on Firebase
  Backend is live on Cloud Run
