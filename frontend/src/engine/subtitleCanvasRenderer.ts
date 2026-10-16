import { TemplateConfig, Word, RGBColor } from '../types';

export interface RenderSubtitleOptions {
  ctx: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  currentTime: number;
  words: Word[];
  config: TemplateConfig;
}

export function rgbToString(color: RGBColor): string {
  const alpha = color.a !== undefined ? color.a : 1;
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

/**
 * Groups raw words into displayable phrase blocks based on punctuation or fixed word count
 */
export function groupWordsIntoBlocks(words: Word[], config: TemplateConfig): Word[][] {
  if (!words || words.length === 0) return [];

  const blocks: Word[][] = [];
  let currentBlock: Word[] = [];

  const maxWords = config.linesCount * config.wordsPerLineCount;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    currentBlock.push(w);

    const hasPunctuation = /[.!?]$/.test(w.punctuated_word || w.word);
    const reachedWordLimit = currentBlock.length >= maxWords;

    if (config.modes.displayWords === 'PUNCTUATION') {
      if (hasPunctuation || reachedWordLimit || i === words.length - 1) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
    } else {
      if (reachedWordLimit || i === words.length - 1) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock);
  }

  return blocks;
}

/**
 * Finds the currently active word block at currentTime
 */
export function getActiveBlock(blocks: Word[][], currentTime: number): Word[] | null {
  for (const block of blocks) {
    if (block.length === 0) continue;
    const blockStart = block[0].start;
    const blockEnd = block[block.length - 1].end;

    // Linger for 0.15s after the last word for visual continuity
    if (currentTime >= blockStart - 0.05 && currentTime <= blockEnd + 0.15) {
      return block;
    }
  }
  return null;
}

/**
 * Core Subtitle Rendering Engine on HTML5 Canvas
 */
export function renderSubtitlesOnCanvas(options: RenderSubtitleOptions): void {
  const { ctx, canvasWidth, canvasHeight, currentTime, words, config } = options;

  const blocks = groupWordsIntoBlocks(words, config);
  const activeBlock = getActiveBlock(blocks, currentTime);

  if (!activeBlock || activeBlock.length === 0) return;

  // Scale font relative to a standard 1080x1920 reference frame
  const scale = canvasWidth / 1080;
  const fontSize = Math.max(16, config.sizes.fontSize * scale);
  const strokeSize = config.sizes.strokeSize * scale;
  const blurSize = config.sizes.blurSize * scale;
  const emojiSize = config.sizes.emojiSize * scale;

  ctx.save();

  // Setup font
  const fontName = config.font.name || 'Inter';
  const fontWeight = config.font.weight || 800;
  ctx.font = `${fontWeight} ${fontSize}px "${fontName}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Apply capitalization
  const formatText = (text: string) => {
    if (config.capitalizationType === 'UPPERCASE') return text.toUpperCase();
    if (config.capitalizationType === 'LOWERCASE') return text.toLowerCase();
    return text;
  };

  // Group words into lines according to linesCount and wordsPerLineCount
  const lines: Word[][] = [];
  const wordsPerLine = Math.ceil(activeBlock.length / Math.min(config.linesCount, 2));
  for (let i = 0; i < activeBlock.length; i += wordsPerLine) {
    lines.push(activeBlock.slice(i, i + wordsPerLine));
  }

  const lineHeight = fontSize * 1.35;
  const totalHeight = lines.length * lineHeight;
  const centerY = (canvasHeight * (config.sizes.posY / 100)) - (totalHeight / 2);

  // Render each line
  lines.forEach((lineWords, lineIdx) => {
    const lineY = centerY + (lineIdx * lineHeight);

    // Measure line total width and individual word items (accounting for emojis)
    const spaceWidth = ctx.measureText(' ').width;
    const isEmojiAbove = config.emojiPosition === 'ABOVE';
    const emojiGap = 8 * scale;

    interface WordLayout {
      wordObj: Word;
      wordText: string;
      textWidth: number;
      itemWidth: number;
      hasEmoji: boolean;
    }

    const wordLayouts: WordLayout[] = lineWords.map((w) => {
      const text = formatText(config.wordHasPunctuation ? w.punctuated_word : w.word);
      const textWidth = ctx.measureText(text).width;
      const hasEmoji = Boolean(w.emoji);
      // If emoji is beside the word, item width includes text + gap + emoji size
      const itemWidth = (hasEmoji && !isEmojiAbove)
        ? textWidth + emojiGap + emojiSize
        : textWidth;

      return {
        wordObj: w,
        wordText: text,
        textWidth,
        itemWidth,
        hasEmoji
      };
    });

    const totalLineWidth = wordLayouts.reduce((sum, item) => sum + item.itemWidth, 0) + (spaceWidth * (wordLayouts.length - 1));

    // Calculate start X according to textAlign
    let currentX: number;
    const align = config.textAlign || 'center';
    if (align === 'left') {
      currentX = canvasWidth * 0.12;
    } else if (align === 'right') {
      currentX = (canvasWidth * 0.88) - totalLineWidth;
    } else {
      currentX = (canvasWidth / 2) - (totalLineWidth / 2);
    }

    ctx.save();

    // Optional rotation tilt angle
    if (config.rotationAngle) {
      const lineCenterX = currentX + (totalLineWidth / 2);
      ctx.translate(lineCenterX, lineY);
      ctx.rotate((config.rotationAngle * Math.PI) / 180);
      ctx.translate(-lineCenterX, -lineY);
    }

    // Draw background pill if enabled
    if (config.wordHasBackground && config.colors.backgroundColor.length > 0) {
      const bgPadX = config.sizes.backgroundPaddingX * scale;
      const bgPadY = config.sizes.backgroundPaddingY * scale;
      const bgRadius = config.sizes.backgroundRadius * scale;

      ctx.save();
      ctx.fillStyle = rgbToString(config.colors.backgroundColor[0]);
      ctx.beginPath();
      ctx.roundRect(
        currentX - bgPadX,
        lineY - (lineHeight / 2) - (bgPadY / 2),
        totalLineWidth + (bgPadX * 2),
        lineHeight + bgPadY,
        bgRadius
      );
      ctx.fill();
      ctx.restore();
    }

    // Render each word
    wordLayouts.forEach((item) => {
      const { wordObj, wordText, textWidth, itemWidth, hasEmoji } = item;
      const isSpoken = currentTime >= wordObj.start && currentTime <= wordObj.end;

      ctx.save();

      // Determine text color
      let textColor = rgbToString(config.colors.defaultColor[0]);
      if (wordObj.highlight && config.colors.hilightColor.length > 0) {
        textColor = rgbToString(config.colors.hilightColor[0]);
      } else if (isSpoken && config.colors.spokenColor.length > 0) {
        textColor = rgbToString(config.colors.spokenColor[0]);
      }

      // Calculate animations
      let animScale = 1.0;
      let animOffsetY = 0;
      let animOffsetX = 0;
      let animAlpha = 1.0;

      if (isSpoken) {
        const wordProgress = Math.min(1, Math.max(0, (currentTime - wordObj.start) / Math.max(0.01, wordObj.end - wordObj.start)));

        switch (config.modes.effectType) {
          case 'POP': {
            animScale = wordProgress < 0.3
              ? 1.0 + (wordProgress / 0.3) * 0.16
              : 1.16 - ((wordProgress - 0.3) / 0.7) * 0.08;
            break;
          }
          case 'SMOOTH_POP': {
            animScale = 1.0 + Math.sin(wordProgress * Math.PI) * 0.12;
            animOffsetY = -Math.sin(wordProgress * Math.PI) * 6 * scale;
            break;
          }
          case 'SHAKE': {
            animScale = 1.08;
            animOffsetX = (Math.random() - 0.5) * 6 * scale;
            animOffsetY = (Math.random() - 0.5) * 6 * scale;
            break;
          }
          case 'GLITCH': {
            animScale = 1.08;
            animOffsetX = Math.sin(currentTime * 30) * 5 * scale;
            break;
          }
          case 'WAVE_SCALE': {
            animScale = 1.0 + Math.sin(currentTime * 12) * 0.14;
            break;
          }
          case 'FADE': {
            animAlpha = Math.min(1, wordProgress * 2.5);
            break;
          }
          default:
            animScale = 1.0;
        }
      }

      // Center of this word item for animation scale
      const itemCenterX = currentX + (itemWidth / 2);
      ctx.translate(itemCenterX + animOffsetX, lineY + animOffsetY);
      ctx.scale(animScale, animScale);
      ctx.globalAlpha = animAlpha;

      // Text position relative to itemCenterX
      const textRelCenterX = (hasEmoji && !isEmojiAbove)
        ? (-itemWidth / 2) + (textWidth / 2)
        : 0;

      // Draw shadow
      if (config.wordHasShadow && config.colors.shadowColor.length > 0) {
        ctx.shadowColor = rgbToString(config.colors.shadowColor[0]);
        ctx.shadowBlur = blurSize;
        ctx.shadowOffsetX = 2 * scale;
        ctx.shadowOffsetY = 4 * scale;
      } else {
        ctx.shadowColor = 'transparent';
      }

      // Draw stroke
      if (strokeSize > 0 && config.colors.strokeColor.length > 0) {
        ctx.strokeStyle = rgbToString(config.colors.strokeColor[0]);
        ctx.lineWidth = strokeSize;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(wordText, textRelCenterX, 0);
      }

      // Draw text fill
      ctx.fillStyle = textColor;
      ctx.fillText(wordText, textRelCenterX, 0);

      // Draw emoji if attached
      if (hasEmoji && wordObj.emoji) {
        let emojiBounceY = 0;
        let emojiScale = 1.0;
        if (config.emojiAnimated && isSpoken) {
          emojiBounceY = -Math.abs(Math.sin(currentTime * 12)) * (10 * scale);
          emojiScale = 1.18;
        }

        ctx.save();
        ctx.shadowColor = 'transparent';

        if (isEmojiAbove) {
          ctx.translate(textRelCenterX, -(fontSize * 0.88) + emojiBounceY);
        } else {
          const emojiRelCenterX = (-itemWidth / 2) + textWidth + emojiGap + (emojiSize / 2);
          ctx.translate(emojiRelCenterX, emojiBounceY);
        }

        ctx.scale(emojiScale, emojiScale);
        ctx.font = `${emojiSize}px sans-serif`;
        ctx.fillText(wordObj.emoji, 0, 0);
        ctx.restore();
      }

      ctx.restore();

      currentX += itemWidth + spaceWidth;
    });

    ctx.restore(); // Restore rotation
  });

  ctx.restore();
}
