# Deployment Guide — WriteSpace Blog

## Platform: Vercel

This guide covers deploying the WriteSpace Blog Angular application to Vercel.

---

## Prerequisites

- A [Vercel](https://vercel.com) account (free tier is sufficient)
- The [Vercel CLI](https://vercel.com/docs/cli) installed (optional, for CLI-based deployments):
  ```bash
  npm i -g vercel
  ```
- Node.js 18.x or later
- Angular CLI 17+ installed globally (or use `npx`):
  ```bash
  npm i -g @angular/cli
  ```
- All project dependencies installed:
  ```bash
  npm install
  ```

---

## Build Command

Vercel will execute the following build command:

```bash
ng build --configuration=production
```

Or equivalently via the npm script:

```bash
npm run build
```

This produces an optimized, ahead-of-time compiled production bundle.

---

## Output Directory

The build output is located at:

```
dist/writespace-blog/browser
```

When configuring Vercel (either via the dashboard or `vercel.json`), set the **Output Directory** to:

```
dist/writespace-blog/browser
```

---

## vercel.json Configuration

Create a `vercel.json` file in the project root to handle SPA routing correctly. All requests that do not match a static file must be rewritten to `index.html` so that Angular's client-side router can handle them.

```json
{
  "buildCommand": "ng build --configuration=production",
  "outputDirectory": "dist/writespace-blog/browser",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### What this does

| Key                | Purpose                                                                 |
|--------------------|-------------------------------------------------------------------------|
| `buildCommand`     | Tells Vercel how to build the project                                   |
| `outputDirectory`  | Points Vercel to the folder containing the production build artifacts   |
| `rewrites`         | Catches all routes and serves `index.html`, enabling Angular routing    |

---

## Environment Variables

**No environment variables are required** for the default deployment.

If you add environment-dependent configuration in the future (e.g., API base URLs, feature flags), manage them through:

1. **Vercel Dashboard** → Project Settings → Environment Variables
2. **Angular environment files** (`src/environments/environment.ts` and `src/environments/environment.prod.ts`)

> **Note:** Angular environment files are baked in at build time. If you need Vercel environment variables to flow into the Angular build, reference them in a custom build script or use `fileReplacements` in `angular.json`.

---

## Deployment Steps

### Option A: Git Integration (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel will auto-detect the framework. Verify the following settings:
   - **Framework Preset:** Other (or Angular if available)
   - **Build Command:** `ng build --configuration=production`
   - **Output Directory:** `dist/writespace-blog/browser`
5. Click **Deploy**.

Every subsequent push to the main branch will trigger an automatic production deployment. Pull requests will generate preview deployments.

### Option B: Vercel CLI

```bash
# From the project root
vercel

# For production deployment
vercel --prod
```

The CLI will read `vercel.json` and apply the configuration automatically.

---

## Troubleshooting SPA Routing on Vercel

### Problem: 404 errors on page refresh or direct URL access

**Cause:** Vercel tries to find a file matching the URL path (e.g., `/blog/my-post`). Since no such file exists on disk, it returns a 404.

**Solution:** Ensure the `rewrites` rule in `vercel.json` is present:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel to serve `index.html` for all non-file routes, allowing Angular Router to handle navigation.

### Problem: Assets (CSS, JS, images) return 404

**Cause:** The `outputDirectory` is misconfigured and does not point to the folder containing `index.html` and the asset files.

**Solution:** Verify the output directory is exactly `dist/writespace-blog/browser`. Run a local build and inspect the folder structure:

```bash
ng build --configuration=production
ls dist/writespace-blog/browser/
```

You should see `index.html`, JavaScript bundles, and asset files in that directory.

### Problem: Blank page with no console errors

**Cause:** The `<base href="/">` tag in `index.html` may be missing or incorrect.

**Solution:** Open `src/index.html` and confirm the `<base>` tag is present inside `<head>`:

```html
<base href="/">
```

### Problem: Build fails on Vercel

**Cause:** Node.js version mismatch or missing dependencies.

**Solution:**
1. Specify the Node.js version in `package.json`:
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```
2. Ensure all dependencies (including `@angular/cli`) are listed in `devDependencies`, not installed globally.
3. Check the Vercel build logs for specific error messages.

---

## CI/CD Notes

### Automatic Deployments

When connected via Git integration, Vercel provides:

- **Production deployments** on every push to the `main` branch (configurable).
- **Preview deployments** on every pull request, with a unique URL for testing.

### Branch Configuration

To change which branch triggers production deployments:

1. Go to **Vercel Dashboard** → **Project Settings** → **Git**.
2. Update the **Production Branch** field.

### Build Caching

Vercel caches `node_modules` between builds. If you encounter stale dependency issues, trigger a fresh build:

```bash
# Via CLI
vercel --force

# Via Dashboard: Deployments → Redeploy → toggle "Clear Build Cache"
```

### Running Tests Before Deployment

Vercel does not run tests by default. To enforce tests before deployment, add a custom build script in `package.json`:

```json
{
  "scripts": {
    "vercel-build": "ng test --watch=false --browsers=ChromeHeadless && ng build --configuration=production"
  }
}
```

Then update `vercel.json`:

```json
{
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "dist/writespace-blog/browser",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### GitHub Actions Integration (Optional)

If you prefer running CI checks in GitHub Actions before Vercel deploys, disable automatic builds in Vercel and use the Vercel GitHub Action:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm test -- --watch=false --browsers=ChromeHeadless
      - run: npm run build

      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

Store `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as GitHub repository secrets.

---

## Quick Reference

| Setting            | Value                                  |
|--------------------|----------------------------------------|
| Build Command      | `ng build --configuration=production`  |
| Output Directory   | `dist/writespace-blog/browser`         |
| Node.js Version    | 18.x or later                          |
| SPA Rewrite        | `/(.*) → /index.html`                  |
| Environment Vars   | None required                          |
| Production Branch  | `main`                                 |