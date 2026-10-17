import { Router } from 'express';
import multer from 'multer';
import { TranscribeController } from '../controllers/transcribe.controller';
import { TemplateController } from '../controllers/template.controller';
import { PaymentController } from '../controllers/payment.controller';
import {
  validateClientKey,
  transcribeLimiter,
  checkoutLimiter
} from '../middleware/security.middleware';

const router = Router();

// Secure file upload with size and MIME validation
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept audio, video, or generic octet-stream (WAV audio blobs)
    if (
      file.mimetype.startsWith('audio/') ||
      file.mimetype.startsWith('video/') ||
      file.mimetype === 'application/octet-stream'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type: Only audio and video recordings are accepted.'));
    }
  }
});

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'autocaptions-api', timestamp: new Date().toISOString() });
});

// Speech-to-text transcription (protected by client key + IP rate limiter)
router.post(
  '/transcribe',
  validateClientKey,
  transcribeLimiter,
  upload.single('file'),
  TranscribeController.transcribe
);

// Template presets & typography (public cacheable assets)
router.get('/templates', TemplateController.getTemplates);
router.get('/templates/:id', TemplateController.getTemplateById);
router.get('/fonts', TemplateController.getFonts);

// Creator support & tips (Dodo Payments, protected by client key + rate limiter)
router.post(
  '/support/checkout',
  validateClientKey,
  checkoutLimiter,
  PaymentController.createSupportCheckout
);

export default router;
