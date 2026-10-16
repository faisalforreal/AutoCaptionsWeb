import { Request, Response } from 'express';
import { DeepgramService } from '../services/deepgram.service';

export class TranscribeController {
  public static async transcribe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No audio/video file provided in request (field: "file")' });
        return;
      }

      const lang = (req.body.lang || req.query.lang || 'en') as string;
      const buffer = req.file.buffer;
      const mimeType = req.file.mimetype || 'audio/wav';

      const result = await DeepgramService.transcribeAudio(buffer, mimeType, lang);

      res.status(200).json(result);
    } catch (err: any) {
      console.error('Transcription error:', err);
      res.status(500).json({
        error: err.message || 'Failed to transcribe audio'
      });
    }
  }
}
