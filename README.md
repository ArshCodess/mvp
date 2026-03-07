<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=CampusHub&fontSize=80&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Your%20Campus,%20Connected.&descAlignY=55&descSize=20" width="100%"/>

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

<br/>

> **🎓 The all-in-one event platform built for university students.**  
> Discover events, register in one click, and never miss what's happening on campus.

<br/>

[**✨ Features**](#-features) • [**🚀 Quick Start**](#-quick-start) • [**📂 Structure**](#-project-structure) • [**🗄️ Database**](#️-database-schema) • [**🤝 Contributing**](#-contributing)

<br/>

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎓 For Students
- 🔍 **Discover Events** — Browse and search campus events with rich filters
- ⚡ **One-Click Registration** — Instant sign-up with your university credentials
- 📋 **Track Your Events** — View and manage all your registered events
- 🔔 **Live Announcements** — Real-time updates from event organizers
- 📱 **Install as App** — Full PWA support for mobile & desktop

</td>
<td width="50%">

### 👨‍💼 For Admins
- 🛠️ **Event Management** — Create, update, and manage events effortlessly
- 📊 **Live Analytics** — Real-time registration stats and capacity tracking
- 📣 **Send Announcements** — Push updates directly to registered attendees
- 🧑‍🤝‍🧑 **Attendee Dashboard** — Full visibility into your event's participants
- 🔐 **Secure Access** — Role-based admin protection via Clerk

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:------|:----------|
| 🖥️ **Framework** | Next.js 16.1.6 (App Router) |
| ⚛️ **Runtime** | React 19.2.3 |
| 🔷 **Language** | TypeScript 5 |
| 🗄️ **Database** | PostgreSQL + Prisma ORM |
| 🔐 **Auth** | Clerk |
| 🎨 **Styling** | Tailwind CSS v4 + PostCSS |
| 🔄 **Data Fetching** | TanStack React Query v5 |
| 📱 **PWA** | next-pwa 5.6.0 |
| 🎯 **Icons** | Lucide React |
| ✅ **Validation** | Zod |

</div>

---

## 🚀 Quick Start

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** `v18+`
- **PostgreSQL** database running locally or in the cloud
- A **[Clerk](https://clerk.com)** account for authentication

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/campushub.git
cd campushub

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# ── Clerk Authentication ──────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# ── Database ──────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/campushub

# ── Optional ──────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Run the App

```bash
# Push database schema
npx prisma migrate dev

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're live! 🎉

---

## 📂 Project Structure

```
campushub/
├── 📁 app/
│   ├── 🔒 (admin)/              # Protected admin routes
│   │   ├── dashboard/           # Admin analytics dashboard
│   │   └── events/
│   │       ├── create/          # New event creation
│   │       └── update/          # Edit existing events
│   ├── 🔑 (auth)/               # Authentication flows
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── 🏠 (main)/               # Core student-facing routes
│   │   ├── events/              # Event listing & detail pages
│   │   ├── home/                # Landing / home feed
│   │   ├── profile/             # University details & user info
│   │   ├── applied/             # Registered events tracker
│   │   └── notifications/       # Event announcements
│   └── 🔌 api/                  # REST API routes (backend)
│       ├── events/              # Event CRUD
│       ├── registrations/       # Registration management
│       ├── profile/             # User profile endpoint
│       └── admin/               # Admin-only endpoints
│
├── 🧩 components/               # Reusable React components
├── 🪝 hooks/                    # Custom React hooks
├── 🛠️ lib/                      # Utility functions & helpers
├── 🗃️ prisma/                   # DB schema & migrations
└── 🌐 public/                   # Static assets & PWA manifest
```

---

## 🗄️ Database Schema

```
┌─────────────┐     ┌──────────────────────┐     ┌──────────────┐
│    User      │────▶│  UniversityDetails   │     │    Event     │
├─────────────┤     ├──────────────────────┤     ├──────────────┤
│ id (Clerk)  │     │ enrollmentNumber     │     │ id           │
│ name        │     │ course               │     │ title        │
│ email       │     │ year                 │     │ description  │
│ role        │     │ department           │     │ date         │
└──────┬──────┘     └──────────────────────┘     │ location     │
       │                                          │ image        │
       │            ┌──────────────┐              │ capacity     │
       └───────────▶│ Registration │◀─────────────┘
                    ├──────────────┤
                    │ userId       │     ┌──────────────────┐
                    │ eventId      │     │  Announcement    │
                    │ status       │     ├──────────────────┤
                    └──────────────┘     │ eventId          │
                                         │ message          │
                                         │ createdAt        │
                                         └──────────────────┘
```

---

## 📦 Scripts

```bash
npm run dev        # 🔥 Start development server (localhost:3000)
npm run build      # 📦 Build for production
npm run start      # 🚀 Start production server
npm run lint       # 🔍 Run ESLint checks
```

---

## 🐛 Troubleshooting

<details>
<summary><b>📄 Manifest not loading (PWA issue)</b></summary>

- Ensure `manifest.json` exists in `/public`
- Verify `layout.tsx` includes `<link rel="manifest" href="/manifest.json" />`
- Check browser console for any 404 errors on the manifest file
</details>

<details>
<summary><b>🗃️ Events not displaying</b></summary>

- Check your `DATABASE_URL` in `.env.local`
- Verify Prisma migrations are up to date: `npx prisma migrate status`
- Inspect API route logs in your terminal for server-side errors
</details>

<details>
<summary><b>🔐 Authentication failing</b></summary>

- Double-check Clerk keys are correctly set in `.env.local`
- Visit your [Clerk Dashboard](https://dashboard.clerk.com) and confirm allowed redirect URLs
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_`
</details>

---

## 🎨 Design System

<div align="center">

| Token | Value |
|:------|:------|
| 🌸 **Primary** | Pink → Purple gradient |
| 📐 **Approach** | Mobile-first with Tailwind breakpoints |
| 🃏 **Components** | Card-based UI with skeleton loaders & empty states |
| ✨ **Animations** | Smooth transitions & hover effects |

</div>

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the project
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m 'feat: add amazing feature'

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request 🎉
```

---

## 📚 Resources

<div align="center">

[![Next.js Docs](https://img.shields.io/badge/Next.js-Docs-black?style=flat-square&logo=next.js)](https://nextjs.org/docs)
[![Prisma Docs](https://img.shields.io/badge/Prisma-Docs-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/docs)
[![Clerk Docs](https://img.shields.io/badge/Clerk-Docs-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/docs)
[![React Query Docs](https://img.shields.io/badge/React_Query-Docs-FF4154?style=flat-square&logo=reactquery)](https://tanstack.com/query/latest)
[![Tailwind CSS Docs](https://img.shields.io/badge/Tailwind-Docs-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/docs)

</div>

---

## 📄 License

This project is **private and proprietary**. All rights reserved.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

**Built with ❤️ for Campus Communities**

*Connecting students, one event at a time.*

</div>