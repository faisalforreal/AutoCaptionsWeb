import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import apiRoutes from './routes/api';
import { globalApiLimiter } from './middleware/security.middleware';

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Allowed origins for CORS protection
const allowedOrigins = [
  'https://autocaptions-free.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  config.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl during dev if needed) or matching allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-autocaption-client-key']
}));

// Global rate limiting
app.use(globalApiLimiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint for hosting platforms (Render, etc.)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'autocaptions-api', timestamp: new Date().toISOString() });
});

// Mount API routes
app.use('/api', apiRoutes);

// Global 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start listening
const server = app.listen(config.PORT, () => {
  console.log(`[AutoCaptions API] Server listening on port ${config.PORT} (http://localhost:${config.PORT})`);
  console.log(`[AutoCaptions API] Deepgram key configured: ${config.DEEPGRAM_API_KEY ? 'YES' : 'NO (Add DEEPGRAM_API_KEY in .env)'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
