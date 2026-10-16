import { TemplateConfig, TranscriptionResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export class ApiService {
  /**
   * Uploads extracted 16kHz audio blob to backend Deepgram transcription service
   */
  public static async transcribeAudio(
    audioBlob: Blob,
    lang = 'en'
  ): Promise<TranscriptionResponse> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('lang', lang);

    const res = await fetch(`${API_BASE_URL}/transcribe`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Transcription failed' }));
      throw new Error(err.error || `Server responded with status ${res.status}`);
    }

    return res.json();
  }

  /**
   * Fetch all 16 viral presets
   */
  public static async getTemplates(): Promise<TemplateConfig[]> {
    const res = await fetch(`${API_BASE_URL}/templates`);
    if (!res.ok) {
      throw new Error('Failed to fetch templates');
    }
    return res.json();
  }

  /**
   * Fetch available fonts
   */
  public static async getFonts(): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/fonts`);
    if (!res.ok) {
      throw new Error('Failed to fetch fonts');
    }
    return res.json();
  }

  /**
   * Check backend health
   */
  public static async checkHealth(): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  }

  /**
   * Create creator support checkout session via backend
   */
  public static async createSupportCheckout(
    amount?: number
  ): Promise<{ checkoutUrl: string; sessionId: string }> {
    const res = await fetch(`${API_BASE_URL}/support/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        returnUrl: window.location.href
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unable to start checkout' }));
      throw new Error(err.error || 'Unable to start checkout');
    }

    return res.json();
  }
}
