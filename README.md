# FloorCrew - Retail Holiday & Flash-Sale Floor Staff (MERN MVP)

## Run it
1. **Server**: `cd server && npm install && cp .env.example .env` then fill `.env` (MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD).
   Create the admin once: `npm run seed:admin`. Start: `npm run dev` (port 8000).
2. **Client**: `cd client && npm install && npm run dev` (http://localhost:5173).

## Try the full flow
Register a Business -> Post a job -> log out -> register a Worker -> Find jobs -> Apply -> log in as Business -> open the job -> Approve -> log in as Worker -> My upcoming jobs. Log in as the admin to see everything.

Never commit `.env`. Admin accounts cannot be created from the public register page.
