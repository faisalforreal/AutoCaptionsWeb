import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

const EXPECTED_CLIENT_KEY = process.env.CLIENT_APP_KEY || 'ac_web_client_prod_89f72b';

/**
 * Validates that requests come from our authorized client application
 */
export const validateClientKey = (req: Request, res: Response, next: NextFunction): void => {
  // Allow health checks and public templates without auth
  if (req.path === '/health' || req.path.startsWith('/templates') || req.path.startsWith('/fonts')) {
    return next();
  }

  const clientKey = req.headers['x-autocaption-client-key'];
  if (!clientKey || clientKey !== EXPECTED_CLIENT_KEY) {
    res.status(403).json({
      error: 'Access denied: Unauthorized client request.'
    });
    return;
  }

  next();
};

/**
 * Rate limiter for AI transcription (protects Deepgram balance from abuse)
 * Limits each IP to 15 transcription requests per 15 minutes.
 */
export const transcribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Transcription rate limit reached. Please wait a few minutes before transcribing another video.'
  }
});

/**
 * Rate limiter for checkout session creation
 */
export const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Checkout request limit exceeded. Please wait a moment.'
  }
});

/**
 * Global rate limiter across all endpoints
 */
export const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP address, please try again after 15 minutes.'
  }
});
