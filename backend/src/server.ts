import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import apiRoutes from './routes/api';

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend development & production origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
