# Bihance

A modern Next.js app (App Router) for building out the **Bihance** platform. Includes a typed setup with Tailwind CSS, Prisma ORM, MDX content support, and Sentry instrumentation.

**Live site:** https://bihance.vercel.app

---

## ✨ Features

- **Next.js App Router** structure in `/app` for server components, layouts, and route handlers.
- **TypeScript-first** codebase with strict types.
- **Tailwind CSS** utility-first styling and PostCSS pipeline.
- **MDX** support for rich content pages/components.
- **Prisma ORM** for database access (see `prisma/`).
- **Sentry** client/server/edge configs for monitoring and error tracking.
- Modular **components** in `/components` (generated/configured via `components.json`).

> A simple `GetUser` resolver is included (takes a `userId` and returns a username) as a minimal example.

---

## 🧱 Project Structure

```

.
├─ app/                 # App Router routes, layouts, route handlers (API)
├─ components/          # UI components
├─ lib/                 # Utilities/helpers
├─ prisma/              # Prisma schema & migrations
├─ public/              # Static assets
├─ tailwind.config.ts   # Tailwind config
├─ postcss.config.mjs   # PostCSS pipeline
├─ next.config.mjs      # Next.js configuration
├─ instrumentation.ts   # (Sentry) App instrumentation
├─ middleware.ts        # Middleware (auth, logging, etc. when used)
└─ package.json

````

---

## 🚀 Getting Started (Local Dev)

### Prerequisites
- **Node.js** ≥ 18
- **pnpm** (recommended): `npm i -g pnpm`
- A database URL (PostgreSQL / MySQL / SQLite, etc.) compatible with your `prisma/schema.prisma`.

### 1) Clone & install
```bash
git clone https://github.com/iamsven2005/bihance.git
cd bihance
pnpm install
````

### 2) Environment variables

Create a `.env.local` file at the project root:

```bash
# Database (adjust provider in prisma/schema.prisma)
DATABASE_URL="postgres://user:password@host:5432/bihance"

# Sentry (optional, if you enable Sentry)
SENTRY_DSN=""                 # e.g. https://<key>@oXXXX.ingest.sentry.io/XXXX
SENTRY_AUTH_TOKEN=""          # if needed for builds
SENTRY_ORG=""
SENTRY_PROJECT=""
```

> Check `prisma/schema.prisma` to confirm the provider and set `DATABASE_URL` accordingly.

### 3) Prisma setup

```bash
# Generate the Prisma client
pnpm dlx prisma generate

# Create/update your database schema
pnpm dlx prisma db push
# or, if you prefer migrations:
pnpm dlx prisma migrate dev
```

### 4) Run the app

```bash
pnpm dev
# open http://localhost:3000
```

> Common scripts (depending on `package.json`):
>
> * `pnpm dev` – start dev server
> * `pnpm build` – production build
> * `pnpm start` – start production server
> * `pnpm lint` – lint code

---

## 🧩 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS, PostCSS
* **Content:** MDX
* **ORM:** Prisma
* **Monitoring:** Sentry
* **Package Manager:** pnpm
* **Hosting:** Vercel

---

## 🔐 Notes on Security & Monitoring

* Sentry configs (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`) are present.

  * Be sure to set `SENTRY_DSN` and any required auth variables only in **private** env files (e.g., `.env.local`) and **never** commit secrets.
* If you add auth, route protection can be wired via `middleware.ts`.

---

## 🗺️ Roadmap (suggested)

* [ ] Database models & migrations for core entities
* [ ] Auth (NextAuth / custom)
* [ ] API route hardening and zod validation
* [ ] UI polish with shadcn/ui primitives
* [ ] E2E tests (Playwright) and unit tests (Vitest/Jest)
* [ ] CI (GitHub Actions) for build, lint, typecheck

---

## 🧪 Development Tips

* Co-locate small server actions within route components in `/app` to keep flows simple.
* Use `lib/` for shared utilities (fetchers, formatters, adapters).
* Keep Prisma types in sync by re-running `prisma generate` after schema edits.

---

## 📝 License

No explicit license file is present. If you plan to reuse or contribute, please open an issue to clarify licensing.

---

## 📬 Feedback

Questions or ideas? Open an issue or reach out via the repository discussions.

[1]: https://github.com/iamsven2005/bihance/ "GitHub - iamsven2005/bihance"
