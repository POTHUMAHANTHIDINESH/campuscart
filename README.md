# CampusCart

A campus marketplace app where students buy and sell books, notes,
electronics, hostel items, and more. Built with React (Vite) on the
frontend and Express + MongoDB on the backend, with Razorpay test-mode
checkout.

Built by a student at **NIT Srinagar**.

## Project structure

```
campuscart/
├── backend/       Express API (auth, products, orders, reviews)
└── frontend/      React app (Vite + React Router)
```

## Prerequisites

- Node.js 18+
- A MongoDB connection string (or leave `MONGO_URI` blank to use an
  in-memory MongoDB for local testing — data resets each restart)

## 1. Backend setup

```bash
cd backend
npm install
npm run dev
```

The API starts on **http://localhost:5000**. `.env` ships with working
local defaults (dummy Razorpay keys, no `MONGO_URI` so it falls back to
an in-memory database). See `.env.example` for what each value means.

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** and talks to the backend at
the URL in `frontend/.env` (`VITE_API_URL`).

---

## Deploying (no live payment integration required)

You do **not** need real Razorpay keys to deploy a working demo.
`backend/routes/orderRoutes.js` already checks whether
`RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` are set — if they aren't (or
you leave the dummy values from `.env.example`), checkout falls back to
a simulated "local" payment flow that marks the order paid instantly.
That's enough for a portfolio demo. Add real Razorpay **test-mode** keys
later if you want the actual Razorpay popup to appear.

### Step 1 — Database: MongoDB Atlas (free)
1. Sign up at https://www.mongodb.com/cloud/atlas/register
2. Create a free (M0) cluster
3. Under **Database Access**, create a user + password
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere — fine for a demo project)
5. Click **Connect → Drivers**, copy the connection string, e.g.
   `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/campuscart`

### Step 2 — Backend: Render (free)
1. Push this repo to GitHub (see below) first
2. Sign up at https://render.com, click **New → Web Service**, connect your GitHub repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (Render dashboard → Environment):
   ```
   MONGO_URI=<your Atlas connection string>
   JWT_SECRET=<any long random string>
   RAZORPAY_KEY_ID=rzp_test_dummy
   RAZORPAY_KEY_SECRET=dummy_secret
   PORT=5000
   ```
7. Deploy — Render gives you a URL like `https://campuscart-backend.onrender.com`

*(Railway works the same way if you prefer it over Render.)*

### Step 3 — Frontend: Vercel (free)
1. Sign up at https://vercel.com, click **Add New → Project**, import the same GitHub repo
2. Root directory: `frontend`
3. Framework preset: Vite (auto-detected)
4. Add environment variable:
   ```
   VITE_API_URL=https://campuscart-backend.onrender.com/api
   ```
   (use your actual Render URL from Step 2)
5. Deploy — Vercel gives you a URL like `https://campuscart.vercel.app`

### Step 4 — Update CORS
Once you know your Vercel URL, restrict the backend's CORS to it instead
of allowing all origins (see `server.js` — currently `app.use(cors())`
with no options, which allows any site). Change it to:
```js
app.use(cors({ origin: "https://campuscart.vercel.app" }));
```
Redeploy the backend after this change.

**Note:** Render's free tier spins down after 15 minutes of inactivity,
so the first request after idle time can take 30-60 seconds to wake up —
this is normal and worth mentioning if a recruiter tries it cold.

---

## Pushing to GitHub

```bash
cd campuscart
git init
git add .
git commit -m "Initial commit: CampusCart full-stack marketplace"
```

Then create an empty repo on GitHub (github.com → New repository, don't
initialize with a README since you already have one), and:

```bash
git remote add origin https://github.com/<your-username>/campuscart.git
git branch -M main
git push -u origin main
```

Both `backend/.gitignore` and `frontend/.gitignore` already exclude
`node_modules/` and `.env`, so your real secrets won't be pushed. Once
deployed (Render/Vercel), set the actual environment variables in their
dashboards, not in the repo.

---

## Why plain CSS instead of Tailwind (even though Tailwind is configured)

This project has `tailwind.config.js` and `postcss.config.js` present,
but the actual styling in `styles.css` uses **hand-written CSS classes**
(`.product-card`, `.navbar`, etc.), not Tailwind utility classes. That's
worth knowing before an interview, since an interviewer who opens
`package.json` and sees Tailwind installed may ask about it.

Two honest options:
1. **Remove the unused Tailwind/PostCSS config** — cleaner, avoids the
   question entirely.
2. **Actually adopt Tailwind's utility classes** — replaces `styles.css`
   with inline `className="flex gap-4 rounded-lg ..."` styling.

Neither is objectively "more interviewer-friendly" — it depends what you
want to signal:
- **Plain CSS** (current approach) shows you understand the CSS
  fundamentals underneath the abstraction — box model, flexbox, custom
  properties (this file uses CSS variables for theming), specificity.
  Some interviewers specifically probe for this because Tailwind can let
  people skip learning it.
- **Tailwind** signals familiarity with the current industry-standard
  tool (used heavily at most startups) and tends to produce more
  consistent spacing/sizing scales with less code, faster.

The pragmatic answer: keep whichever one the codebase actually uses
consistently, and be ready to explain the tradeoff either way. Given
this project is already fully styled in plain CSS, I'd lean toward
removing the unused Tailwind config rather than doing a full rewrite —
that's a bigger, separate task if you want it done properly.

## What was filled in

This repo was assembled/hardened from the original uploaded files. Added:

- **Backend:** `models/*.js`, `middleware/validate.js`,
  `middleware/rateLimiter.js` — server-side input validation
  (express-validator) on signup/login/listings/reviews, and rate limiting
  on auth routes to slow brute-force login attempts.
- **Reviews:** a buyer can now only review a seller after a **paid**
  order containing that exact product exists — enforced both in the API
  (`POST /api/reviews`, `GET /api/reviews/eligibility/:productId`) and at
  the database level (unique index preventing duplicate reviews).
- **Frontend:** `context/AuthContext.jsx`, `context/CartContext.jsx`
  (cart now persists to `localStorage` across refreshes),
  `components/Navbar.jsx`, `ProtectedRoute.jsx`, `ProductCard.jsx`,
  `ReviewList.jsx` (now purchase-gated), `Footer.jsx`, and
  `pages/Terms.jsx`, `Privacy.jsx`, `Contact.jsx`, `Feedback.jsx`.
- **Layout fix:** footer now sticks to the bottom of the viewport on
  short pages instead of floating up right after the content.

## Known limitations (worth being upfront about)

- The Feedback page form doesn't persist anywhere yet — it's UI-only.
  Wiring it to a real `POST /api/feedback` route + model is a natural
  next step.
- No automated tests yet.
- No image upload — sellers paste an image URL rather than uploading a
  file (Cloudinary/S3 integration would be the next improvement).
