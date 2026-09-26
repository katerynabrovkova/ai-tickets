@AGENTS.md

## Project: AI ticket processing
Internal tool for a support team. UI language: Ukrainian.

### Features
- Form: customer name + ticket text, saved to the database.
- List of all tickets (newest first); data persists across page reloads.
- "Аналізувати (AI)" button on each ticket card: calls Claude and saves
  priority (low/medium/high), category (payment/delivery/complaint/other),
  summary (one sentence, Ukrainian), draft_reply (reply draft to the customer, Ukrainian).
- Analysis result is shown on the ticket card.

### Data model (table: tickets)
id serial PK, customer_name text, message text, created_at timestamptz default now(),
priority text null, category text null, summary text null, draft_reply text null,
analyzed_at timestamptz null. A ticket is "not analyzed" when analyzed_at is null.

### Stack
- Next.js App Router, TypeScript, Tailwind
- Neon Postgres + Drizzle ORM, env var DATABASE_URL
- Anthropic SDK, model claude-sonnet-5, env var ANTHROPIC_API_KEY
- Structured output via tool use, validated with zod

### Rules
- The API key is used only on the server. Never use the NEXT_PUBLIC_ prefix for secrets.
- Secrets live in .env.local, which must never be committed.
- Simple, clean design, nothing excessive.
- Work in small steps and verify each step works before moving on.
