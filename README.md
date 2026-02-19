# VanItGo - Moving Service Platform

Built with **Next.js 15** · **Chakra UI v3** · **TypeScript** · **Drizzle ORM** · **NextAuth v5** · **Stripe** · **Mapbox**

## 🚀 Project Status

✅ **Phase 1 & 2 Complete:**
- Complete project structure scaffolded
- Next.js 15 App Router configured
- TypeScript with strict mode enabled
- All required dependencies in package.json
- Database schema (Drizzle ORM) defined
- Authentication setup (NextAuth v5)
- API route structure complete
- UI theme configured (Premium Dark)
- Middleware for route protection
- Email service (Resend) configured
- Payment processing (Stripe) ready
- Maps integration (Mapbox) ready

## 📊 Architecture Overview

```
src/
├── app/                 # Next.js App Router
│   ├── (marketing)/    # Public marketing pages
│   ├── (auth)/         # Authentication pages
│   ├── (dashboard)/    # Customer dashboard (protected)
│   ├── (driver)/       # Driver portal (protected)
│   ├── (admin)/        # Admin console (protected)
│   ├── book/           # Booking wizard flow
│   ├── api/            # API routes
│   └── layout.tsx      # Root layout with providers
├── components/         # React components by feature
├── lib/               # Utilities & integrations
│   ├── auth/          # NextAuth config
│   ├── db/            # Database client & schema
│   ├── email/         # Resend email service
│   ├── mapbox/        # Maps integration
│   ├── stripe/        # Payment processing
│   └── theme.ts       # Chakra UI theme
├── server/            # Server-side code
│   ├── auth/          # Authentication logic
│   └── db/            # Database setup
├── types/             # TypeScript types
├── styles/            # Global CSS
├── hooks/             # Custom React hooks
└── utils/             # Helper functions
```

## 🎨 Theme Configuration

**Premium Dark Theme:**
- Background: #06061A (deep space)
- Primary: #7B2FFF (electric purple)
- CTA: #FFB800 (vibrant gold)
- Text: #F0EFFF (light)
- Card Radius: 10px
- Shadow: Purple glow effect

**Fonts:**
- Headings: Plus Jakarta Sans
- Body: Inter

## 🔐 Authentication & Authorization

**NextAuth v5 with DB Sessions:**
- Email/password authentication
- Google OAuth ready
- Role-based access: guest, customer, driver, admin
- Protected routes with middleware
- Session management via database

## 🗄️ Database Schema

**Tables:**
- `users` - User accounts with roles
- `drivers` - Driver profiles & certifications
- `bookings` - Moving bookings
- `payments` - Payment transactions
- `notifications` - User notifications
- `carbon_offsets` - Ecologi integration
- `sessions` - NextAuth sessions

All with proper indexes for performance.

## 💳 Payment Integration

**Stripe:**
- Checkout flow (/api/payments/checkout)
- Webhook handler (/api/payments/webhook)
- Refund processing (/api/payments/refund)
- Currency: GBP

## 📍 Maps & Distance

**Mapbox:**
- Geocoding service
- Distance/duration calculation
- Real-time location tracking placeholder

## 📧 Email Service

**Resend:**
- Booking confirmations
- Driver assignment notifications
- Payment receipts
- Template ready

## 🌱 Carbon Offsetting

**Ecologi Integration:**
- CO2 estimation based on distance
- Per-booking offset tracking

## 📦 UK Removal Items Dataset

Step 2 (Items & Details) in the booking wizard uses the **UK Removal Dataset** (398 items across 18 categories). To set it up:

1. **Generate the items JSON** (run after pulling or when dataset path changes):
   ```bash
   npm run removal:generate
   ```
   Uses `C:\VanJet\UK_Removal_Dataset\Complete_Item_Database.csv` by default. Override with `UK_REMOVAL_DATASET_PATH` env var.

2. **Copy item images** (optional, for thumbnails in the picker):
   ```bash
   npm run removal:images
   ```
   Copies from `Images_Only` to `public/removal-items/`.

Outputs: `public/data/removal-items.json` and `public/removal-items/<category>/` images.

## 🚦 What's Next

### Phase 3 - Feature Implementation (When Ready)
- [ ] Implement booking wizard components
- [ ] Build payment checkout flow
- [ ] Create dashboard UIs
- [ ] Driver portal features
- [ ] Admin management interfaces
- [ ] Real-time tracking (WebSocket)
- [ ] SMS notifications (Twilio)
- [ ] AI volume estimation (Groq)
- [ ] Comprehensive error handling
- [ ] Input validation & sanitization

### Phase 4 - Testing & Deployment
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance optimization
- [x] Vercel deployment (see [DEPLOYMENT.md](./DEPLOYMENT.md))
- [ ] CI/CD pipeline

## 🚀 Deploy to Vercel

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for environment variables, Stripe webhook setup, migrations, and step-by-step Vercel deployment.

## 📝 Environment Variables

Copy `.env.local.example` to `.env.local` and populate:

```bash
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me-in-production

# APIs
NEXT_PUBLIC_MAPBOX_TOKEN=pk_...
STRIPE_SECRET_KEY=sk_test_...
RESEND_API_KEY=re_...
GROQ_API_KEY=gsk_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## 🎯 Development Commands

```bash
# Install dependencies
npm install

# Development server (Port 3000)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint

# Database commands
npm run db:generate   # Generate migrations
npm run db:push       # Push schema to DB
npm run db:studio     # Open Drizzle Studio
npm run db:seed       # Seed test data

# Testing
npm run test          # Unit tests
npm run test:e2e      # E2E tests
```

## 🤝 Development Guidelines

- **Strict TypeScript** - No `any` types
- **Component Accessibility** - ARIA labels, keyboard focus, reduced-motion support
- **Mobile-First** - All layouts responsive from 320px
- **API Validation** - Zod schemas on all routes
- **Error Boundaries** - On every page
- **Loading States** - Skeletons for async sections
- **No Secrets in Client** - Use NEXT_PUBLIC_ prefix only for safe vars

## 📞 Route Structure Summary

**Marketing:** `/`, `/services`, `/pricing`, `/faq`, `/contact`, `/blog`
**Auth:** `/login`, `/register`, `/forgot-password`
**Customer:** `/book/*` (wizard), `/dashboard/*` (my bookings, profile)
**Driver:** `/driver/*` (jobs, earnings, documents)
**Admin:** `/admin/*` (bookings, drivers, customers, analytics)

## ✨ Status

Ready for **Phase 3: Feature Implementation**

Questions? Review `/tasks.txt` for full specifications.
