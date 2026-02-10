# Signal AI

> Career intelligence, amplified.

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Project Structure](#project-structure) • [Environment Variables](#environment-variables) • [Deployment](#deployment)

---

## Overview

Signal AI is an AI-powered job analysis platform that helps professionals assess how strong their profile is for a specific role **before** they apply. It provides data-driven fit scores, skill gap detection, risk assessments, and strategic interview angles.

## Features

- **AI Job Analysis** — Paste a job URL or description, get a comprehensive fit report powered by Google Gemini
- **Profile Management** — Build your professional profile with skills, experience, and education
- **Resume Import** — Upload a PDF resume and auto-populate your profile via AI extraction
- **Fit Score** — Quantified percentage showing how well your profile matches a role
- **Skill Gap Detection** — Identifies missing keywords and requirements
- **Risk Assessment** — Flags potential concerns a hiring manager might raise
- **Interview Strategy** — Tailored talking points to highlight your strengths
- **Dashboard & Insights** — Aggregated analytics across all your analyses with AI-generated summaries
- **Charts & Visualizations** — Fit score distribution, risk breakdown, and company comparison charts
- **Google OAuth** — Sign in with Google or email/password
- **Demo Mode** — Try the app instantly with demo credentials

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, React 19) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, shadcn/ui, Framer Motion |
| **Database** | Supabase (Postgres + Auth + Row Level Security) |
| **AI** | Google Gemini (`@google/genai`) |
| **Validation** | Zod 4 + React Hook Form |
| **Icons** | Lucide React |
| **Toasts** | Sonner |
| **PDF Parsing** | pdfjs-dist |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Google Gemini API key](https://ai.google.dev)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/signal-ai.git
cd signal-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in the values (see Environment Variables below)

# Run Supabase migrations (if using Supabase CLI)
npx supabase db push

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
signal-ai/
├── app/                    # Next.js App Router
│   ├── auth/               # Authentication (login, signup, OAuth callback)
│   ├── dashboard/          # Protected dashboard
│   │   ├── _components/    # Dashboard-specific components (charts, client)
│   │   ├── jobs/           # Job listing, creation, and analysis views
│   │   ├── profile/        # Profile management (form, read view)
│   │   └── settings/       # Account settings
│   ├── lib/                # Supabase client, utilities
│   ├── globals.css          # Design system tokens (Stone + Emerald palette)
│   ├── layout.tsx           # Root layout (fonts, metadata, toaster)
│   ├── page.tsx             # Landing page
│   ├── loading.tsx          # Global loading state
│   ├── error.tsx            # Route-level error boundary
│   └── global-error.tsx     # Root-level error boundary
│
├── actions/                # Server Actions (all data mutations)
│   ├── analysis.ts         # AI-powered job analysis
│   ├── insights.ts         # Aggregated dashboard insights
│   ├── jobs.ts             # Job CRUD operations
│   ├── profiles.ts         # Profile CRUD operations
│   ├── resume.ts           # Resume PDF parsing + AI extraction
│   ├── scraper.ts          # Job URL content scraping
│   └── account.ts          # Account management
│
├── schemas/                # Zod validation schemas
│   ├── profiles.schema.ts  # Profile, Experience, Education
│   ├── jobs.schema.ts      # Job posting
│   ├── analysis.schema.ts  # Analysis results
│   ├── auth.schema.ts      # Login/Signup
│   └── resume.schema.ts    # Resume parsing output
│
├── components/             # Shared UI components
│   ├── ui/                 # shadcn/ui primitives (Button, Card, Input, etc.)
│   └── shared/             # App-level shared components (Header, Footer)
│
├── supabase/
│   └── migrations/         # Database migration files
│
├── docs/                   # Documentation
│   └── DESIGN_SYSTEM.md    # UI/UX principles and guidelines
│
└── utils/                  # Utility functions
```

## Environment Variables

Create a `.env` file in the project root:

```env
# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# AI
GEMINI_API_KEY=your_gemini_api_key

# Optional: Demo credentials (for demo sign-in button)
DEMO_EMAIL=demo@demo.com
DEMO_PASSWORD=your_demo_password
```

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Design System

Signal AI uses a **"Stone & Emerald"** design system focused on being calm, analytical, and trustworthy. Key principles:

- **Palette**: Stone (warm gray) neutrals + Emerald accents. No generic AI blues.
- **Typography**: Geist Sans + Geist Mono. Tight tracking on headings, relaxed leading on body.
- **Motion**: Restrained. `ease-out duration-200` only. No bouncy animations.
- **Components**: Bordered cards, minimal shadows, monochrome-first with emerald highlights.

See [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) for the complete guide.

## Deployment

Signal AI is designed to deploy on [Vercel](https://vercel.com):

1. Push your repo to GitHub
2. Import into Vercel
3. Add all environment variables
4. Deploy

Supabase handles the database, auth, and storage. No additional infrastructure required.

## License

MIT

---

*Built with precision. Engineered for clarity.*