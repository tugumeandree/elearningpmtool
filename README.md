# Project Management Dashboard

Slack-style project implementation dashboard built with Next.js 14 (App Router), TypeScript, Tailwind CSS, PapaParse, and date-fns.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- PapaParse
- date-fns
- lucide-react

## Data Source

CSV is fetched from Google Sheets export URL:

`https://docs.google.com/spreadsheets/d/1PVL-Aie9TXKTeuB_8ATqk6k6X-c42649IsIReIzxDJk/export?format=csv`

The parser supports both:
- `Progress`
- `Progress (%)`

Date input is normalized from either `YYYY-MM-DD` or `M/D/YYYY`.

## Interface

Defined in `lib/fetchSheet.ts`:

```ts
interface Task {
  taskId: string
  taskName: string
  phase: string
  owner: string
  startDate: string
  endDate: string
  status: "Not Started" | "In Progress" | "Waiting for Client" | "Delayed" | "Completed"
  progress: number
  notes: string
}
```

## Project Structure

```text
app/
  dashboard/
    page.tsx
components/
  Sidebar.tsx
  TaskFeed.tsx
  GanttChart.tsx
  ChannelView.tsx
  Toast.tsx
lib/
  fetchSheet.ts
```

## Local Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Deploy To Netlify

This project is Netlify-ready via:
- `netlify.toml`
- `@netlify/plugin-nextjs`

### Option 1: Connect GitHub Repo In Netlify UI

Use these settings:
- Build command: `npm run netlify-build`
- Publish directory: leave empty (handled by Next.js plugin)
- Node version: `20` (already set in `netlify.toml`)

### Option 2: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --build
netlify deploy --prod --build
```

### Option 3: GitHub Actions Auto Deploy

Workflow file: `.github/workflows/netlify-deploy.yml`

Triggers:
- push to `main`
- manual run via `workflow_dispatch`

Required GitHub repository secrets:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

How to get values:
- `NETLIFY_AUTH_TOKEN`: Netlify user settings -> Applications -> Personal access tokens
- `NETLIFY_SITE_ID`: Site settings -> General -> Site details

## Notes

- Dev cache is configured to in-memory in `next.config.mjs` to avoid Windows filesystem cache corruption in `.next`.
- Production build output remains standard Next.js.
