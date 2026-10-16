import { createClient } from '@deepgram/sdk';
import { config } from '../config/env';
import { TranscriptionResponse, Word } from '../types';
import { EmojiService } from './emoji.service';

export class DeepgramService {
  private static client = config.DEEPGRAM_API_KEY
    ? createClient(config.DEEPGRAM_API_KEY)
    : null;

  public static async transcribeAudio(
    audioBuffer: Buffer,
    mimeType = 'audio/wav',
    language = 'en'
  ): Promise<TranscriptionResponse> {
    if (!config.DEEPGRAM_API_KEY) {
      throw new Error(
        'DEEPGRAM_API_KEY is not set in backend/.env. Please configure your Deepgram API key to transcribe audio.'
      );
    }

    const client = createClient(config.DEEPGRAM_API_KEY);

    const response = await client.listen.prerecorded.transcribeFile(audioBuffer, {
      model: 'nova-2',
      language: language === 'auto' ? undefined : language,
      detect_language: language === 'auto',
      smart_format: true,
      punctuate: true,
      words: true,
      utterances: true,
      mimetype: mimeType
    });

    if (response.error) {
      throw new Error(`Deepgram transcription failed: ${response.error.message}`);
    }

    const results = response.result?.results;
    if (!results || !results.channels || results.channels.length === 0) {
      return {
        words: [],
        duration: 0,
        language: language,
        confidence: 0
      };
    }

    const channel = results.channels[0];
    const alternative = channel.alternatives[0];

    if (!alternative || !alternative.words) {
      return {
        words: [],
        duration: response.result?.metadata?.duration || 0,
        language: results.channels[0].detected_language || language,
        confidence: 0
      };
    }

    // Convert Deepgram word structures to standard Word[]
    const rawWords: Word[] = alternative.words.map((w: any) => ({
      start: Number(w.start.toFixed(2)),
      end: Number(w.end.toFixed(2)),
      word: w.word,
      punctuated_word: w.punctuated_word || w.word,
      confidence: w.confidence,
      speaker: w.speaker
    }));

    // Enrich with contextual emojis
    const wordsWithEmojis = EmojiService.enrichWords(rawWords);

    return {
      words: wordsWithEmojis,
      duration: response.result?.metadata?.duration || (rawWords.length > 0 ? rawWords[rawWords.length - 1].end : 0),
      language: results.channels[0].detected_language || language,
      confidence: alternative.confidence || 0.95
    };
  }
}
