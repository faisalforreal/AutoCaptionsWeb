import { Router } from 'express';
import multer from 'multer';
import { TranscribeController } from '../controllers/transcribe.controller';
import { TemplateController } from '../controllers/template.controller';

const router = Router();

// Memory storage for fast streaming to Deepgram without disk IO bottlenecks
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max limit
  }
});

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'autocaptions-api', timestamp: new Date().toISOString() });
});

// Speech-to-text transcription
router.post('/transcribe', upload.single('file'), TranscribeController.transcribe);

// Template presets & typography
router.get('/templates', TemplateController.getTemplates);
router.get('/templates/:id', TemplateController.getTemplateById);
router.get('/fonts', TemplateController.getFonts);

export default router;
