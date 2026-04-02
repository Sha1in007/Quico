# ⚡ Quico — Quick AI Tools

> Summarize text, explain code, write emails, and generate ideas — all from a single command interface.

Built with **Next.js 14**, **MongoDB**, **JWT Auth**, and **Claude AI (Anthropic)**.

---

## ✨ Features

- 🧠 **AI-Powered Tools** — Summarize, explain code, write emails, generate ideas
- 🎯 **Intent Detection** — Automatically detects what you're asking for
- 🔐 **JWT Authentication** — Secure login/register with httpOnly cookies
- 📜 **Query History** — All past queries saved and accessible
- 📋 **Copy to Clipboard** — One-click copy for any output
- 🌙 **Dark Mode UI** — Minimal command-palette design
- 📱 **Responsive** — Works on all screen sizes

---

## 🗂 Project Structure

```
quico/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx       # Login page
│   │   └── register/page.tsx    # Register page
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── ai/route.ts          # Main AI processing endpoint
│   │   └── history/route.ts     # History CRUD
│   ├── dashboard/page.tsx       # Main app interface
│   ├── layout.tsx
│   ├── page.tsx                 # Redirects to /dashboard
│   └── globals.css
├── components/
│   ├── CommandInput.tsx         # Main command input with suggestions
│   ├── OutputCard.tsx           # AI response card with markdown
│   ├── HistoryPanel.tsx         # Slide-in history panel
│   ├── Navbar.tsx               # Top navbar
│   └── LoadingDots.tsx          # Animated loading dots
├── lib/
│   ├── mongodb.ts               # MongoDB connection with caching
│   ├── auth.ts                  # JWT sign/verify helpers
│   └── aiRouter.ts              # Intent detection + Claude API calls
├── models/
│   ├── User.ts                  # User schema (bcrypt hashed passwords)
│   └── History.ts               # History schema
├── middleware.ts                # Route protection
├── .env.example
└── README.md
```

---

## 🚀 Local Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd quico
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/quico
JWT_SECRET=your_super_secret_32_char_minimum_key
ANTHROPIC_API_KEY=sk-ant-...
```

#### Getting your keys:

| Key | Where to get it |
|-----|----------------|
| `MONGODB_URI` | [MongoDB Atlas](https://cloud.mongodb.com) → Create free cluster → Connect → Drivers |
| `JWT_SECRET` | Run `openssl rand -base64 32` in terminal |
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com) → API Keys |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Quico AI tools app"
git remote add origin https://github.com/<your-username>/quico.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"** → Import your `quico` repository
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ANTHROPIC_API_KEY`
4. Click **Deploy**

Your live URL will be something like `https://quico.vercel.app`

---

## 🔧 How It Works

### Intent Detection (`lib/aiRouter.ts`)
The app uses regex pattern matching to detect what the user wants:

| Input Pattern | Intent | Tool |
|--------------|--------|------|
| "summarize...", "tldr..." | `summarize` | 📝 Summarize |
| "explain code...", code blocks | `explain_code` | 💻 Explain Code |
| "write email...", "draft mail..." | `generate_email` | ✉️ Write Email |
| "ideas...", "brainstorm...", "startup..." | `generate_ideas` | 💡 Generate Ideas |
| Everything else | `general` | ✨ General |

### API Flow
```
User Input → /api/ai → detectIntent() → Claude API → Save to History → Return response
```

---

## 📝 Example Queries

```
Summarize this: [paste any article]

Explain this code:
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

Write a formal email for requesting an internship at Google

Give me startup ideas for college students in India
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookies) |
| AI | Anthropic Claude (claude-sonnet-4) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Markdown | React Markdown + Syntax Highlighter |
| Deployment | Vercel |

---

## 👨‍💻 Built By

Made for B.Tech resume project by [Your Name]

---

## 📄 License

MIT
