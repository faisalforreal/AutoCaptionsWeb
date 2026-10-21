# AutoCaption — Production AI Video Captions & Viral Subtitles

> An end-to-end, production-ready clone of [AutoCaption.io](https://autocaption.io/), reverse-engineered to provide 300+ viral creator styles, word-level audio alignment powered by Deepgram Nova-2, and **100% free client-side video rendering**.

---

## 🌟 Key Features

- **300+ Viral Creator Presets**:
  - *Hormozi Bold* (900-weight yellow highlight with thick black outline)
  - *MrBeast Explosive* (High-energy comic pop with bouncy emojis)
  - *Ali Abdaal Clean* (Dark minimalist pill backdrop with sky blue highlight)
  - *Cyberpunk Neon* (Cyan & magenta glow with glitch chromatic aberration)
  - *Dev / Code Pill* (Monospace terminal aesthetic)
  - *Karaoke Gold* (Continuous word wipe lyric progression)
  - *Luxury Editorial* (Instrument Serif high-end fashion styling)
  - *Glitch Beast*, *TikTok Bouncy*, *Retro Wave*, *News Breaking*, *Comic Pop*, and more!
- **Deepgram Nova-2 AI Transcription**:
  - Word-level float timestamps (`start`, `end`, `word`, `punctuated_word`).
  - Automatic capitalization and sentence boundary detection.
  - Multi-language support (30+ languages) with Right-to-Left (RTL) Arabic/Hebrew support.
- **Client-Side Audio Extraction (Option A)**:
  - Web Audio API compresses the audio track into a 16kHz mono WAV buffer directly in the browser before upload, taking &lt;1 second even on 4K videos.
- **100% Free Hardware-Accelerated Video Rendering**:
  - Employs Canvas 2D and the **WebCodecs API** with `mp4-muxer` to encode 1080p 60fps MP4s directly on the user's GPU.
  - Zero server GPU costs — host the backend on free-tier containers!
- **Export Options**:
  - Burned-in 1080p / 720p MP4.
  - Subtitle export: `.SRT`, `.VTT`, and raw JSON timestamps.
- **Modern Dark UI**:
  - Styled with Tailwind CSS and Magic UI (`Marquee`, `BorderBeam`, `ShimmerButton`, `MagicCard`).

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+ (tested on Node v22)
- Deepgram API Key (add to `backend/.env`)

### 1. Start the Backend
```bash
cd backend
cp .env.example .env
# Edit .env and paste your DEEPGRAM_API_KEY
npm install
npm run dev
```
The backend API will start at `http://localhost:5000`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`. Open in your browser to experience the studio!

---

## 🐳 Production Deployment

Run with Docker Compose:
```bash
docker compose up -d --build
```
For detailed cloud hosting setup (Vercel + Render), refer to [`DEPLOYMENT.md`](./DEPLOYMENT.md).
