# CampusCart

A campus marketplace app for students to buy and sell books, notes,
electronics, hostel items, cycles, and more with each other.

Built by a student at NIT Srinagar.

## Features

- Sign up / log in with a college email
- Browse and search listings by category
- Post your own listings for sale
- Add items to cart and check out with Razorpay (test mode)
- View your order history
- Leave a review for a seller, but only after actually buying from them
- Manage your own listings (view, delete)

## Tech stack

**Frontend:** React, Vite, React Router, Axios, plain CSS
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT authentication
**Payments:** Razorpay

## Project structure

```
campuscart/
├── backend/    Express API — auth, products, orders, reviews
└── frontend/   React app
```

## Running it locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:5000`. Copy `.env.example` to `.env` and fill
in your own values (MongoDB URI, JWT secret, Razorpay keys).

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## Payments

Checkout uses Razorpay. If you don't add real Razorpay test keys, it
falls back to a simulated payment so you can still test the full
checkout flow without any setup. Add your own free test-mode keys from
the Razorpay dashboard to see the real checkout popup with test cards.

## What I'm still working on

- Persisting the feedback form to a database
- Automated tests
- Image upload for listings instead of pasting a URL
