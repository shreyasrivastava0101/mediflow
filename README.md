# Mediflow 🚀

A world-class, resume-worthy healthcare workflow platform built with a modern tech stack. Mediflow provides an ultra-premium UI for smart bed allocation, automated doctor assignment, and live hospital analytics.

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS v4, Framer Motion, Recharts
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Design:** Glassmorphism, Neon dark-mode aesthetics, Smooth Micro-interactions

## Features
1. **Interactive Hero Landing Page** - Futuristic, glowing, animated elements.
2. **Hospital Command Center (Dashboard)** - Real-time statistics, glowing animated widgets.
3. **Live Bed Occupancy Chart** - Visualizes ICU, Emergency, and General bed status.
4. **Emergency Queue Visualizer** - Sorted patient queue with severity badges.
5. **Smart Doctor Allocation** - Dynamic doctor cards showing specialization and patient load.
6. **Smart Bed Engine** - Backend logic allocating patients based on symptom severity.

## Local Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install

# Make sure you have MongoDB running locally, or modify the .env MONGODB_URI to an Atlas cluster.
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Seed Mock Data
The backend comes with a seeder that populates the DB with 100 patients, 50 beds, and 30 doctors.
Send a `POST` request to:
`http://localhost:5000/api/seed`

### 4. Default Login
- **Email:** `admin@mediflow.com`
- **Password:** `admin123`

---

## Deployment Guide (Vercel & Render)

Since Mediflow requires linked external accounts, follow these steps to get your live deployment URLs:

### Deploy Backend (Render)
1. Push this repository to GitHub.
2. Go to [Render](https://render.com/) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Set Build Command to `npm install`.
6. Set Start Command to `npm start`.
7. Add Environment Variables:
   - `MONGODB_URI` = Your MongoDB Atlas Connection String
   - `JWT_SECRET` = `supersecret_mediflow_jwt_key_2026`
8. Click **Deploy**.

### Deploy Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Import this GitHub repository.
3. Set the Root Directory to `frontend`.
4. Vercel will automatically detect **Vite** and configure the build settings (`npm run build`).
5. (Optional) Add `VITE_API_URL` to environment variables pointing to your Render Backend URL.
6. Click **Deploy**.

*Mediflow will now be fully live on the internet!*
