<div align="center">

# UNJYNX Web

### Landing Page + Admin Dashboard

[![Astro](https://img.shields.io/badge/Astro-4.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5.x-0170FE?logo=antdesign&logoColor=white)](https://ant.design)

**Two production-ready web apps powering the UNJYNX platform**

---

</div>

## Structure

```
unjynx-web/
  landing/            # Marketing website (Astro + Tailwind)
  admin/              # Admin dashboard (React + Refine + Ant Design)
  .github/workflows/  # CI/CD pipelines
```

---

## Landing Page ( /landing )

The public-facing marketing website for UNJYNX.

### Tech Stack
- **Framework**: Astro 4.16 (static site generation)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (with security headers, CSP, asset caching)
- **Testing**: Playwright E2E

### Components

| Component | Description |
|-----------|-------------|
| **Nav** | Responsive navigation with mobile hamburger menu |
| **Hero** | Animated hero section with CTA |
| **Features** | Feature showcase grid with icons |
| **Channels** | 8 notification channels visual display |
| **Pricing** | Plan comparison (Free / Pro / Team / Family) |
| **Testimonials** | User testimonials carousel |
| **FAQ** | Expandable FAQ accordion |
| **Footer** | Links, social media, legal pages |

### Pages
- `/` Home (main landing page)
- `/privacy` Privacy Policy
- `/terms` Terms of Service

### Security Headers
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

### Run Locally

```bash
cd landing
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # generates dist/
```

---

## Admin Panel ( /admin )

Internal dashboard for managing the UNJYNX platform. Protected behind OIDC admin login.

### Tech Stack
- **Framework**: React 19 + TypeScript
- **UI Library**: Refine 4.x + Ant Design 5.x
- **Charts**: Recharts
- **Auth**: OIDC via Logto (admin roles only)
- **Build**: Vite
- **Testing**: Vitest + React Testing Library

### Pages (15)

| Page | Description |
|------|-------------|
| **Login** | OIDC authentication gate |
| **Dashboard** | KPI cards (Users, DAU, Revenue, Engagement) + trend charts |
| **Users List** | Searchable user table with plan/status filters |
| **User Detail** | Individual user profile, activity, subscription |
| **Content List** | Daily content management with CRUD |
| **Content Create** | Rich content editor with category assignment |
| **Content Calendar** | Visual content scheduling calendar |
| **Notifications** | Delivery metrics, channel health, queue depths |
| **Failed Notifications** | Retry/debug failed deliveries |
| **Feature Flags** | Toggle features per user/plan/percentage |
| **Flag Detail** | Detailed flag configuration |
| **Analytics** | DAU/MAU trends, retention, funnel analysis |
| **Billing** | Revenue metrics, subscription overview |
| **Compliance** | DPDP Act status, data requests, audit trail |
| **Support** | User tickets and escalations |

### Architecture

```
Admin Panel
    |
    +-- AuthProvider (Logto OIDC)
    |   Only super_admin / dev_admin roles allowed
    |
    +-- DataProvider (Simple REST)
    |   Connects to UNJYNX Backend API (/api/v1/admin/*)
    |
    +-- Pages
        +-- Dashboard  -> GET /admin/stats, /admin/analytics
        +-- Users      -> GET/PATCH /admin/users
        +-- Content    -> CRUD /admin/content
        +-- Flags      -> CRUD /admin/feature-flags
```

### Run Locally

```bash
cd admin
pnpm install
pnpm dev      # http://localhost:5173
```

Environment variables:
```
VITE_API_URL=http://localhost:3000/api/v1
VITE_LOGTO_ENDPOINT=http://localhost:3001
VITE_LOGTO_APP_ID=your-admin-app-id
```

---

## Deployment

### Vercel (Recommended)

Both apps are configured for Vercel deployment:

```bash
# Landing page
cd landing && vercel --prod

# Admin panel
cd admin && vercel --prod
```

### Environment Variables (Vercel)

**Landing**: No env vars needed (static site).

**Admin**:

| Variable | Value |
|----------|-------|
| VITE_API_URL | https://api.unjynx.com/api/v1 |
| VITE_LOGTO_ENDPOINT | https://auth.unjynx.com |
| VITE_LOGTO_APP_ID | Your Logto admin app ID |

## Connected Services

```
                  +------------------+
                  |   Cloudflare     |
                  |   (CDN / DNS)    |
                  +--------+---------+
                           |
            +--------------+--------------+
            v              v              v
   +------------+   +------------+   +------------+
   |  Landing   |   |   Admin    |   |  Backend   |
   |  (Vercel)  |   |  (Vercel)  |   | (Hetzner)  |
   |            |   |            |   |            |
   | unjynx.com |   |   admin.   |   |   api.     |
   |            |   | unjynx.com |   | unjynx.com |
   +------------+   +------+-----+   +------------+
                           |               ^
                           +---------------+
                         REST API calls
```

---

<div align="center">

**Built with care by [METAminds](https://github.com/AndrousStark)**

*Break the satisfactory. Unjynx your productivity.*

</div>
