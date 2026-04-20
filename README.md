# Grummans Blog Client

Vue 3 + TypeScript + Tailwind CSS frontend for a blog application.

## Summary

Grummans Blog Client is a modern frontend focused on clean blog presentation, post discovery, and responsive user experience. It integrates with a backend API through the `/api` route convention and is optimized for container-based delivery.

## Tech Stack

- Vue 3 (Composition API)
- TypeScript (strict)
- Vite
- Tailwind CSS + `@tailwindcss/typography`
- Vue Router
- VueUse, date-fns

## Architecture Highlights

- Component-driven UI using Vue Single File Components
- Route-based page structure via Vue Router
- Centralized API access pattern for consistent response handling
- Tailwind utility styling with typography plugin for article content

## CI/CD Status

The repository includes CI and Docker publish workflows for both GitHub and Gitea.

### CI Workflows

- GitHub: `.github/workflows/ci.yml`
- Gitea: `.gitea/workflows/ci.yml`

Scope:

- Automated verification on push and pull request targets (`main`, `develop`)
- Type-check and production build validation

### Docker Publish Workflows

- GitHub: `.github/workflows/publish.yml`
- Gitea: `.gitea/workflows/publish.yml`

Scope:

- Image publishing triggered by version tags (`v*`) or manual dispatch
- No image publish on regular branch commits

### Image Tag Policy

Published image tags are:

- Short commit hash only (for example: `a1b2c3d`)
- `latest`

The `sha-` prefix is disabled.
