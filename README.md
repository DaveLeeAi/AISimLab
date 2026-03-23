# AISimLab

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-gexxz8fy)

AISimLab is a full-stack interactive simulation and calculator platform that lets anyone run financial, business, health, and data calculations instantly — no spreadsheets or specialist knowledge required.

---

## What It Does

AISimLab provides a growing library of 50+ interactive tools organized into categories. Each tool accepts user inputs, computes results in real time, and optionally uses AI to explain what the numbers mean in plain English. Results can be saved and shared via a unique link.

---

## Tool Categories

| Category | Description |
|----------|-------------|
| **Finance** | Mortgage, compound interest, savings goals, debt payoff, retirement, rent vs. buy, inflation |
| **Business** | Profit margins, startup runway, CAC, pricing strategy, employee costs, ROI, break-even |
| **Planning** | Trip budgets, project cost estimates, meeting costs, wedding and event budgets, moving costs |
| **Productivity** | Hourly rate, salary-to-hourly, focus time, working hours, PTO, deadline calculators |
| **Health** | BMI, TDEE / calorie needs, water intake, ideal weight, sleep, heart rate, due date |
| **Data & Math** | Percentage calculations, unit conversions (length, weight, temperature, speed, currency) |
| **Science** | Physics, chemistry, and engineering simulations |
| **Decisions** | Probability tools, risk assessment, and decision frameworks |

---

## Key Features

- **50+ calculators** with real-time results and formula documentation
- **AI-powered explanations** — results are interpreted in plain English using Claude
- **Natural language search** — find the right tool by describing your goal
- **Shareable simulations** — save any calculation and share it with a unique URL
- **Public REST API** — programmatic access to tools with API key authentication and rate limiting
- **Fully responsive** — works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Routing | React Router v6 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Serverless | Supabase Edge Functions (Deno) |
| AI | Anthropic Claude (via Edge Functions) |

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured tools, trending, categories |
| `/tools` | Browse full tool catalog |
| `/search` | Search tools by keyword or natural language |
| `/tools/:category` | All tools in a given category |
| `/tools/:category/:slug` | Individual tool with calculator, docs, and examples |

---

## Edge Functions

| Function | Purpose |
|----------|---------|
| `ai-explain` | Generates plain-English explanations of calculation results using Claude Haiku |
| `ai-find-tools` | Matches a natural language query to the most relevant tools |
| `share-simulation` | Creates and retrieves shareable simulation snapshots |
| `tool-api` | REST API for running tools programmatically with key-based auth and rate limiting |

---

## Database

The Supabase database includes tables for:

- Tool and category metadata
- User profiles and saved simulations
- Shared simulation snapshots
- API keys and usage tracking
- Analytics events

Row Level Security (RLS) is enabled on all tables.

---

## Project Structure

```
src/
├── tools/          # Tool definitions and calculation logic
├── data/           # Categories, collections, tool registry
├── pages/          # Route-level page components
├── components/
│   ├── layout/     # Header, Footer, Layout
│   ├── ui/         # Button, Badge, SearchBar
│   ├── tools/      # ToolCard, ToolEngine
│   └── home/       # Hero, Trending, Featured, CategoryGrid
├── lib/            # Supabase client, analytics helpers
supabase/
└── functions/      # Edge Functions (ai-explain, ai-find-tools, share-simulation, tool-api)
```
