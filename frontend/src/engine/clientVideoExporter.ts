import { TemplateConfig, Word } from '../types';
import { renderSubtitlesOnCanvas } from './subtitleCanvasRenderer';

export interface ExportProgress {
  percent: number;
  currentFrame: number;
  totalFrames: number;
  fps: number;
  elapsedSec: number;
}

export interface ExportOptions {
  videoElement: HTMLVideoElement;
  words: Word[];
  config: TemplateConfig;
  resolution: '1080p' | '720p';
  onProgress: (progress: ExportProgress) => void;
}

/**
 * 100% Client-Side Hardware-Accelerated Video Exporter.
 * Renders video frames + animated subtitles + synchronizes audio directly in the user's browser.
 * Free, zero server CPU/GPU cost!
 */
export async function exportCaptionedVideoClientSide(options: ExportOptions): Promise<Blob> {
  const { videoElement, words, config, resolution, onProgress } = options;

  // Determine export dimensions
  let targetWidth = 1080;
  let targetHeight = 1920;

  if (resolution === '720p') {
    targetWidth = 720;
    targetHeight = 1280;
  }

  // Handle landscape videos if original video is horizontal
  if (videoElement.videoWidth > videoElement.videoHeight) {
    const temp = targetWidth;
    targetWidth = targetHeight;
    targetHeight = temp;
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    throw new Error('Failed to create Canvas 2D context for video export');
  }

  // Setup Web Audio graph to record original video audio track
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const dest = audioCtx.createMediaStreamDestination();
  const source = audioCtx.createMediaElementSource(videoElement);
  source.connect(dest);
  source.connect(audioCtx.destination); // Keep preview audible or muted

  // Canvas stream
  const canvasStream = canvas.captureStream(30);

  // Combine canvas video track + Web Audio destination audio track
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks()
  ]);

  // Determine supported mime type
  const mimeType = [
    'video/mp4;codecs=avc1,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=h264,opus',
    'video/webm;codecs=vp9,opus',
    'video/webm'
  ].find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

  const recorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: resolution === '1080p' ? 8_000_000 : 4_000_000
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const duration = videoElement.duration || 10;
  const fps = 30;
  const totalFrames = Math.ceil(duration * fps);
  let currentFrame = 0;
  const startTime = performance.now();

  return new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      audioCtx.close();
      const outputBlob = new Blob(chunks, { type: mimeType });
      resolve(outputBlob);
    };

    recorder.onerror = (err) => {
      audioCtx.close();
      reject(err);
    };

    // Prepare video playback from start
    videoElement.currentTime = 0;
    videoElement.muted = false;

    videoElement.onseeked = () => {
      recorder.start(100);
      videoElement.play();

      const renderLoop = () => {
        if (videoElement.paused || videoElement.ended || videoElement.currentTime >= duration) {
          if (recorder.state === 'recording') {
            recorder.stop();
          }
          return;
        }

        // Draw current video frame to canvas (maintaining aspect ratio with letterboxing if needed)
        const vW = videoElement.videoWidth;
        const vH = videoElement.videoHeight;
        const vAspect = vW / vH;
        const cAspect = targetWidth / targetHeight;

        let drawW = targetWidth;
        let drawH = targetHeight;
        let drawX = 0;
        let drawY = 0;

        if (vAspect > cAspect) {
          // Video is wider
          drawH = targetWidth / vAspect;
          drawY = (targetHeight - drawH) / 2;
        } else {
          // Video is taller
          drawW = targetHeight * vAspect;
          drawX = (targetWidth - drawW) / 2;
        }

        // Black canvas background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // Draw video frame
        ctx.drawImage(videoElement, drawX, drawY, drawW, drawH);

        // Draw synchronized subtitles
        renderSubtitlesOnCanvas({
          ctx,
          canvasWidth: targetWidth,
          canvasHeight: targetHeight,
          currentTime: videoElement.currentTime,
          words,
          config
        });

        // Report progress
        currentFrame++;
        const elapsed = (performance.now() - startTime) / 1000;
        const progressPercent = Math.min(99, Math.round((videoElement.currentTime / duration) * 100));

        onProgress({
          percent: progressPercent,
          currentFrame,
          totalFrames,
          fps: Math.round(currentFrame / Math.max(0.1, elapsed)),
          elapsedSec: Math.round(elapsed)
        });

        requestAnimationFrame(renderLoop);
      };

      requestAnimationFrame(renderLoop);
    };
  });
}

/**
 * Format timestamp in SRT format: 00:01:24,500
 */
function formatSRTTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss},${ms}`;
}

/**
 * Format timestamp in VTT format: 00:01:24.500
 */
function formatVTTTime(seconds: number): string {
  return formatSRTTime(seconds).replace(',', '.');
}

/**
 * Generates standard .SRT subtitle file from words
 */
export function generateSRT(words: Word[], wordsPerBlock = 4): string {
  if (!words || words.length === 0) return '';

  let srt = '';
  let index = 1;

  for (let i = 0; i < words.length; i += wordsPerBlock) {
    const block = words.slice(i, i + wordsPerBlock);
    const start = block[0].start;
    const end = block[block.length - 1].end;
    const text = block.map((w) => w.punctuated_word || w.word).join(' ');

    srt += `${index}\n`;
    srt += `${formatSRTTime(start)} --> ${formatSRTTime(end)}\n`;
    srt += `${text}\n\n`;
    index++;
  }

  return srt;
}

/**
 * Generates standard WebVTT (.VTT) subtitle file from words
 */
export function generateVTT(words: Word[], wordsPerBlock = 4): string {
  let vtt = 'WEBVTT\n\n';
  let index = 1;

  for (let i = 0; i < words.length; i += wordsPerBlock) {
    const block = words.slice(i, i + wordsPerBlock);
    const start = block[0].start;
    const end = block[block.length - 1].end;
    const text = block.map((w) => w.punctuated_word || w.word).join(' ');

    vtt += `${index}\n`;
    vtt += `${formatVTTTime(start)} --> ${formatVTTTime(end)}\n`;
    vtt += `${text}\n\n`;
    index++;
  }

  return vtt;
}

/**
 * Triggers instant browser download of a generated file blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
