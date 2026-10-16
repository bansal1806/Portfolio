# Shourya Bansal — MERN Portfolio

A full-stack personal portfolio built with **MongoDB, Express.js, React and Node.js**.
It has animated sections, dark/light mode, a project showcase with filters, CV downloads in **PDF and Word** served by the Express API, and a contact form that stores messages in MongoDB.

| | Link |
|---|---|
| 🌐 Live site (Vercel) | https://your-portfolio.vercel.app |
| ⚙️ API (Render) | https://portfolio-api.onrender.com/api/health |

<p align="center">
  <img src="docs/screenshot-dark.png" alt="Desktop, dark mode" width="72%" />
  <img src="docs/screenshot-mobile-light.png" alt="Mobile, light mode" width="22%" />
</p>

---

## Features

| Section | What's included |
|---|---|
| **Hero** | Staggered entrance animation, typewriter role effect, animated gradient background, *Download CV* CTA |
| **About** | Bio, profile photo, location & current status, animated counters, slide-in on scroll |
| **Skills** | Grouped into Frontend / Backend / Tools, animated progress bars, radial category charts, hover/focus tooltips with proficiency level |
| **Projects** | Interactive cards with tech badges, GitHub + live demo links, **filter by technology** and **sort** by date/name, detail page per project |
| **Resume** | Download CV as **PDF** or **DOCX** via `GET /api/cv/:format` |
| **Journey** | Vertical animated timeline for education and experience, with a line that draws as you scroll |
| **Certifications** | Certificate images with lightbox and verify links, plus achievements and hackathons |
| **Contact** | Validated form → `POST /api/contact` → stored in MongoDB (Mongoose), optional email via Nodemailer |

**Also included:** React Router SPA (`/`, `/projects`, `/projects/:slug`, 404) · Framer Motion animations · dark/light toggle saved to localStorage with no flash on load · responsive layouts tested at 360 px, 390 px, 768 px, 1024 px and 1280 px · scroll-spy navbar · lazy-loaded routes · rate limiting, honeypot spam protection, Helmet and a CORS whitelist · API test suite.

## Tech stack

- **Frontend:** React 19, React Router 7, Framer Motion, react-icons, Vite
- **Backend:** Node.js, Express 5, Mongoose, Nodemailer, Helmet, express-rate-limit
- **Database:** MongoDB Atlas
- **CV generation:** pdfkit + docx
- **Testing:** node:test, supertest, mongodb-memory-server
- **Hosting:** Vercel (client) + Render (API)

## Project structure

```
portfolio/
├── client/                    # React SPA (Vite)
│   ├── public/                # favicon, profile photo, certificate images
│   └── src/
│       ├── components/        # Navbar, Footer, Reveal, ProjectCard, CVButtons…
│       ├── context/           # ThemeContext (dark/light)
│       ├── data/portfolio.js  # ← all site content lives here
│       ├── hooks/             # useTypewriter, useActiveSection
│       ├── pages/             # Home, ProjectsPage, ProjectDetail, NotFound
│       ├── sections/          # Hero, About, Skills, Projects, Timeline, …
│       ├── styles/            # base / components / sections CSS
│       └── api.js, config.js  # API client & base URL
├── server/                    # Express REST API
│   ├── files/                 # generated CV (PDF + DOCX)
│   ├── scripts/               # generate-cv.js + resume-data.js
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/Message.js
│   │   ├── routes/            # health, contact, cv
│   │   └── utils/mailer.js
│   └── tests/
└── render.yaml                # Render blueprint for the API
```

## API

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | API + database status |
| `POST` | `/api/contact` | Body `{ name, email, message }` → saves a message (5 requests / 15 min per IP) |
| `GET` | `/api/cv` | Lists available CV formats |
| `GET` | `/api/cv/pdf` | Downloads the CV as PDF |
| `GET` | `/api/cv/docx` | Downloads the CV as Word document |

## Running locally

**Prerequisites:** Node.js 18+ and a MongoDB connection string (Atlas free tier or local `mongod`).

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
npm run install:all

# environment variables (never commit the real .env files)
cp server/.env.example server/.env    # then set MONGODB_URI, etc.
cp client/.env.example client/.env    # VITE_API_URL=http://localhost:5000

npm run dev        # API → http://localhost:5000, site → http://localhost:5173
npm test           # API tests (uses an in-memory MongoDB)
```

### Environment variables

| File | Variable | Purpose |
|---|---|---|
| `server/.env` | `MONGODB_URI` | MongoDB connection string |
| | `CLIENT_ORIGIN` | Comma-separated origins allowed by CORS (e.g. your Vercel URL) |
| | `PORT` | API port (Render sets this automatically) |
| | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL` | *Optional:* email notification for new messages |
| `client/.env` | `VITE_API_URL` | Base URL of the API, no trailing slash |

## Updating content

- **Website content:** edit `client/src/data/portfolio.js` (profile, skills, projects, timeline, certificates).
- **Photo / certificates:** drop images into `client/public/images/` and `client/public/certificates/`, then update their paths in `portfolio.js`.
- **CV:** edit `server/scripts/resume-data.js`, then run `npm run generate:cv` to rebuild both the PDF and the DOCX.

## Deployment

### Backend → Render
1. Create a free **MongoDB Atlas** cluster, add a database user, and allow access from `0.0.0.0/0` under *Network Access*.
2. On Render, choose **New → Blueprint** and select this repo. `render.yaml` sets up the service from `/server`.
   *(Or choose New → Web Service with root directory `server`, build command `npm ci --omit=dev` and start command `npm start`.)*
3. Set `MONGODB_URI` and `CLIENT_ORIGIN=https://<your-site>.vercel.app` in the Render dashboard.
4. Check that `https://<your-api>.onrender.com/api/health` returns `"database": "connected"`.

### Frontend → Vercel
1. **Add New → Project**, import the repo and set **Root Directory** to `client` (Vercel detects Vite).
2. Add the environment variable `VITE_API_URL=https://<your-api>.onrender.com`.
3. Deploy. `vercel.json` handles SPA rewrites so `/projects/...` deep links work.

> Render's free tier sleeps when idle. The site pings `/api/health` on load to wake it up, but the first request after a long idle period can still take ~30 s.

## License

MIT © Shourya Bansal
