# Production Deployment Guide: AutoCaption

This guide explains how to deploy both the **Frontend** and **Backend** to production.

---

## Architecture Overview

- **Frontend**: Single-Page React App (Vite). All video rendering, frame drawing, and 1080p MP4 exports run **100% client-side** using the user's browser GPU (Canvas 2D + WebCodecs API). No server rendering load.
- **Backend**: Express + Node.js API gateway. Handles Deepgram Nova-2 speech-to-text, emoji dictionary tagging, and template metadata. Extremely lightweight (runs comfortably on 256MB–512MB RAM free instances).

---

## 1. Quick Deploy with Docker Compose (VPS / Self-Hosted)

If deploying to a VPS (Ubuntu, Debian, etc.):

```bash
# 1. Clone repository
git clone <your-repo-url>
cd AutoCaptionsWeb

# 2. Configure Deepgram API key in backend
cp backend/.env.example backend/.env
# Edit backend/.env and add your DEEPGRAM_API_KEY

# 3. Launch both services
docker compose up -d --build
```

- Frontend will be live on `http://your-server-ip:3000`
- Backend API will be live on `http://your-server-ip:5000`

---

## 2. Free Cloud Hosting Setup (Recommended)

### A. Deploy Frontend to Vercel / Cloudflare Pages / Netlify (Free Forever)

1. Connect your GitHub repository to **Vercel** or **Cloudflare Pages**.
2. Set Root Directory to: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.com/api`
6. Deploy!

### B. Deploy Backend to Render / Railway / Fly.io (Free / Low Cost)

Because video rendering is offloaded to the client, the backend only proxies lightweight 16kHz audio streams to Deepgram. A free 512MB container can handle hundreds of concurrent users without breaking a sweat!

1. Create a new Web Service on **Render** (or Railway).
2. Set Root Directory to: `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add Environment Variables:
   - `PORT`: `5000`
   - `DEEPGRAM_API_KEY`: `<your_deepgram_api_key>`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-frontend-vercel-url.app`
6. Deploy!
