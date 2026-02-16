# PixHive Setup Guide

## Stack Overview

- **Supabase** — Auth + Database + File Storage (all-in-one)
- **Railway** — Hosting
- **Stripe** — Payments

---

## What's Already Built ✅

### Frontend (Complete)
- Landing page with full marketing content
- Login/Signup with Google OAuth + Email
- Dashboard showing all events
- Create event form
- Event detail page with QR code + photo gallery
- Guest upload page (mobile-first, no login required)

### Backend (Complete)
- Supabase client setup (browser + server)
- Auth middleware for protected routes
- Photo upload API with Supabase Storage
- Database schema with RLS policies

---

## Setup Steps

### 1. Supabase Project (15 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for it to initialize (~2 minutes)

**Database:**
3. Go to **SQL Editor** and run the contents of `supabase-schema.sql`

**Storage:**
4. Go to **Storage** in the sidebar
5. Create a new bucket called `photos`
6. Make it **Public** (toggle in bucket settings)

**Auth:**
7. Go to **Authentication > Providers** and enable:
   - Email (already enabled)
   - Google (see step 2 below)

**API Keys:**
8. Go to **Settings > API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Google OAuth (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or use existing
3. Go to **APIs & Services > Credentials**
4. Create **OAuth 2.0 Client ID**
   - Type: Web application
   - Authorized redirect URIs: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
5. Copy Client ID and Secret to Supabase Auth > Providers > Google

### 3. Stripe (15 minutes)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Copy API keys from **Developers > API Keys**:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
3. Create Products (one-time payments):
   - **Starter** - $39
   - **Plus** - $69
   - **Pro** - $99
4. Copy each Price ID:
   - `STRIPE_PRICE_STARTER`
   - `STRIPE_PRICE_PLUS`
   - `STRIPE_PRICE_PRO`
5. Set up Webhook:
   - Go to **Developers > Webhooks**
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### 4. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in values:

```bash
cp .env.local.example .env.local
```

### 5. Deploy to Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) and create new project
3. Select "Deploy from GitHub repo"
4. Add environment variables from `.env.local`
5. Deploy!

---

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## Testing the Flow

1. **Sign up** with email or Google
2. **Create an event** with a name and date
3. **Copy the share link** or scan the QR code
4. **Upload photos** from the guest page (try on your phone!)
5. **View photos** in your dashboard

---

## File Structure

```
/pixhive
├── app/
│   ├── (auth)/           # Login, signup pages
│   ├── (dashboard)/      # Protected host pages
│   ├── api/              # API routes
│   ├── e/[slug]/         # Guest upload (public)
│   └── page.tsx          # Landing page
├── components/
│   ├── layout/           # Header, Footer, Nav
│   ├── events/           # Event components
│   └── ui/               # shadcn components
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── storage.ts        # Supabase Storage functions
│   ├── actions/          # Server actions
│   └── types/            # TypeScript types
├── .env.local.example    # Environment template
├── supabase-schema.sql   # Database schema
└── SETUP.md              # This file
```

---

## Quick Reference

| Service | Dashboard | Docs |
|---------|-----------|------|
| Supabase | [supabase.com/dashboard](https://supabase.com/dashboard) | [supabase.com/docs](https://supabase.com/docs) |
| Railway | [railway.app](https://railway.app) | [docs.railway.app](https://docs.railway.app) |
| Stripe | [dashboard.stripe.com](https://dashboard.stripe.com) | [stripe.com/docs](https://stripe.com/docs) |
