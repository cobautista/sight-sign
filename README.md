# Sight-Sign
## Construction Site Safety Induction System

Sight-Sign is a digital construction site safety induction system that replaces traditional clipboard-based paperwork with a modern QR code-based workflow. Workers receive unique QR codes (similar to event tickets) that they display on their mobile devices. Site administrators scan these codes to instantly sign workers in, trigger safety quiz completion, and update a real-time dashboard showing current site occupancy.

**Project Type:** Web Application
**Status:** Initial Setup Complete
**Version:** 0.1.0

---

## Features

### MVP (Phase 1 - 4 Weeks)

- **Worker Registration & Unique QR Codes**: Workers create accounts and receive permanent QR codes
- **Admin QR Scanning**: Real-time camera-based scanning via WebRTC
- **Interactive Safety Quiz**: 5-question quiz with soft-fail educational approach
- **Real-Time Dashboard**: Live worker list with Supabase Realtime subscriptions
- **Auto Sign-Out**: Automatic sign-out at 6 PM daily
- **Mobile-Responsive Design**: Optimized for smartphones and tablets

### Planned (Phase 2-3)

- Skip quiz for return visitors (<30 days)
- Delivery driver tracking (basic)
- **Emergency Mustering** (Premium - $29/month): SMS alerts, real-time headcount
- **Tool Checkout Tracking** (Premium): QR-based asset management
- **Certification Tracking** (Premium): OSHA cert expiry monitoring
- Multi-site management (Premium)

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript 5.9, Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL 15, Auth, Realtime, Edge Functions)
- **Hosting:** Vercel
- **QR Generation:** qrcode library (client-side)
- **QR Scanning:** html5-qrcode (WebRTC)
- **State Management:** React Context + hooks

See [TECH-STACK.md](../ultrathink-docs/sight-sign/TECH-STACK.md) for detailed rationale.

---

## Architecture

Sight-Sign uses a modern serverless architecture with Next.js 14 on Vercel for the frontend and Supabase for the complete backend. The system leverages Row Level Security (RLS) for multi-tenant data isolation, Supabase Realtime for instant dashboard updates (<1s latency), and WebRTC for browser-based QR code scanning. Real-time WebSocket subscriptions enable workers to appear on the admin dashboard immediately after sign-in without polling.

See [ARCHITECTURE-v1.0.md](../ultrathink-docs/sight-sign/ARCHITECTURE-v1.0.md) for complete architecture documentation.

---

## Getting Started

### Prerequisites

- Node.js 20.x LTS
- npm 10.x
- Supabase account (free tier)
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone git@github.com-personal:cobautista/sight-sign.git
cd sight-sign

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

### Configuration

Required environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

See [DEPLOYMENT-GUIDE.md](../ultrathink-docs/sight-sign/DEPLOYMENT-GUIDE.md) for production setup.

---

## Project Structure

```
sight-sign/
├── app/
│   ├── (auth)/                # Auth layouts (login, register)
│   ├── (worker)/              # Worker layouts (dashboard, quiz)
│   ├── (admin)/               # Admin layouts (dashboard, scan)
│   └── api/                   # API routes
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── qr-code/               # QR display component
│   ├── qr-scanner/            # WebRTC scanner component
│   └── dashboard/             # Dashboard widgets
├── lib/
│   ├── supabase/              # Supabase client setup
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # Helper functions
├── public/                    # Static assets
├── supabase/
│   ├── migrations/            # Database migrations
│   └── functions/             # Edge Functions (auto-signout, etc.)
└── tests/                     # Unit and integration tests
```

---

## Documentation

All project documentation is stored in `../ultrathink-docs/sight-sign/`:

- **PRD-v1.0.md** - Product Requirements Document
- **ARCHITECTURE-v1.0.md** - System Architecture
- **TECH-STACK.md** - Technology choices and rationale
- **DEPLOYMENT-GUIDE.md** - Production deployment instructions
- **NEXT-STEPS.md** - Your first development tasks
- **diagrams/** - Visual documentation (Excalidraw prompts)

---

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

### Database Migrations

```bash
# Using Supabase CLI
supabase migration new migration_name
supabase db push
```

---

## Deployment

See [DEPLOYMENT-GUIDE.md](../ultrathink-docs/sight-sign/DEPLOYMENT-GUIDE.md) for complete deployment instructions to Vercel + Supabase.

**Quick Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

---

## Next Steps

See [NEXT-STEPS.md](../ultrathink-docs/sight-sign/NEXT-STEPS.md) for your prioritized development tasks.

**Recommended First Task:** Implement worker registration and QR code generation (Week 1, Priority 1)

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

---

## License

Proprietary - Freemium model planned

---

## Contact

Project maintained by Cob (Internal)

---

**Generated by UltraThink Project Initialization** - 2025-12-27
