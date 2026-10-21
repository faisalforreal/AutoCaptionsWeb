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

  // In strictly one-word mode, each block contains exactly 1 word
  if (config.modes.displayMode === 'WORD') {
    return words.map(w => [w]);
  }

  const blocks: Word[][] = [];
  let currentBlock: Word[] = [];

  const maxWords = Math.max(1, config.linesCount * config.wordsPerLineCount);

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
 * Helper to draw 4-point star sparkle
 */
function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    ctx.rotate(Math.PI / 2);
    ctx.lineTo(size, 0);
    ctx.lineTo(size * 0.25, size * 0.25);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Core Subtitle Rendering Engine on HTML5 Canvas
 * Reverse-engineers and executes the authentic CapCut animation mechanics:
 * - SPRING_BOUNCE: Elastic spring overshoot with vertical bounce
 * - GLOW_PULSE: Luminescent neon bloom expanding and breathing
 * - KARAOKE_WIPE: Smooth horizontal color scan gradient across active word
 * - JITTER_SHAKE: Fast energetic vibration jitter
 * - STRETCH_SNAP: Vertical rubber elasticity that snaps back
 * - GLITCH_RGB: Chromatic aberration red/cyan split
 * - SWAY_FLOAT: Rhythmic pendulum sway and floating drift
 * - FLIP_3D: 3D perspective flip along horizontal axis
 * - RISE_UP: Smooth upward entrance glide with progressive opacity
 * - TYPEWRITER: Progressive character-by-character reveal
 * - EXTRUDE_3D: Multi-layered 3D isometric block offset shadow
 * - RAINBOW_CYCLE: Prismatic spectrum hue rotation
 * - SPARKLE_TWINKLE: Orbiting star sparkles
 * - SMOKE_FADE: Luminescent soft haze dissolving into clarity
 * - VARIETY_PUNCH: Double-pulse variety show shockwave scale
 */
export function renderSubtitlesOnCanvas(options: RenderSubtitleOptions): void {
  const { ctx, canvasWidth, canvasHeight, currentTime, words, config } = options;

  if (!words || words.length === 0) return;

  const scale = canvasWidth / 1080;
  const fontSize = Math.max(16, config.sizes.fontSize * scale);
  const strokeSize = config.sizes.strokeSize * scale;
  const blurSize = config.sizes.blurSize * scale;
  const emojiSize = config.sizes.emojiSize * scale;
  const isEmojiAbove = config.emojiPosition === 'ABOVE';
  const emojiGap = 8 * scale;

  ctx.save();

  const fontName = config.font.name || 'Montserrat Bold';
  const fontWeight = config.font.weight || 800;
  ctx.font = `${fontWeight} ${fontSize}px "${fontName}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const formatText = (text: string) => {
    if (config.capitalizationType === 'UPPERCASE') return text.toUpperCase();
    if (config.capitalizationType === 'LOWERCASE') return text.toLowerCase();
    return text;
  };

  // =========================================================================
  // ONE-WORD DISPLAY MODE (Strictly 1 word at a time)
  // =========================================================================
  if (config.modes.displayMode === 'WORD') {
    let activeWord: Word | null = null;
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const nextStart = i < words.length - 1 ? words[i + 1].start : w.end + 0.15;
      const lingerEnd = Math.min(w.end + 0.08, nextStart);
      if (currentTime >= w.start - 0.02 && currentTime <= lingerEnd) {
        activeWord = w;
        break;
      }
    }

    if (!activeWord) {
      ctx.restore();
      return;
    }

    const wordText = formatText(config.wordHasPunctuation ? activeWord.punctuated_word : activeWord.word);
    const textWidth = ctx.measureText(wordText).width;
    const hasEmoji = Boolean(activeWord.emoji);
    const itemWidth = (hasEmoji && !isEmojiAbove)
      ? textWidth + emojiGap + emojiSize
      : textWidth;

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight * (config.sizes.posY / 100);

    const wordDur = Math.max(0.01, activeWord.end - activeWord.start);
    const wordProgress = Math.min(1, Math.max(0, (currentTime - activeWord.start) / wordDur));

    let animScaleX = 1.0;
    let animScaleY = 1.0;
    let animOffsetY = 0;
    let animOffsetX = 0;
    let animAlpha = 1.0;
    let animRotation = config.rotationAngle || 0;
    let currentGlowBlur = blurSize;

    // Apply specific animation mechanic
    switch (config.modes.effectType) {
      case 'SPRING_BOUNCE': {
        const decay = 4.5;
        const freq = 12;
        const bounce = Math.sin(wordProgress * freq) * Math.exp(-wordProgress * decay);
        const s = 1.0 + (1 - wordProgress) * 0.28 + bounce * 0.15;
        animScaleX = s;
        animScaleY = s;
        animOffsetY = -Math.abs(Math.sin(wordProgress * Math.PI)) * (12 * scale);
        break;
      }
      case 'GLOW_PULSE': {
        const pulse = (Math.sin(currentTime * 12) + 1) / 2;
        currentGlowBlur = blurSize + pulse * 24 * scale;
        animScaleX = 1.08 + pulse * 0.08;
        animScaleY = animScaleX;
        break;
      }
      case 'STRETCH_SNAP': {
        const snap = Math.sin(wordProgress * Math.PI);
        animScaleX = 1.0 - snap * 0.15;
        animScaleY = 1.0 + snap * 0.35;
        animOffsetY = -snap * 8 * scale;
        break;
      }
      case 'JITTER_SHAKE': {
        animOffsetX = (Math.random() - 0.5) * 8 * scale;
        animOffsetY = (Math.random() - 0.5) * 8 * scale;
        animScaleX = 1.12;
        animScaleY = 1.12;
        break;
      }
      case 'SWAY_FLOAT': {
        animRotation += Math.sin(currentTime * 6) * 4;
        animOffsetY = Math.sin(currentTime * 8) * 6 * scale;
        animScaleX = 1.08;
        animScaleY = 1.08;
        break;
      }
      case 'FLIP_3D': {
        const flipProg = Math.min(1, wordProgress * 3);
        animScaleY = Math.max(0.05, Math.sin(flipProg * Math.PI * 0.5));
        animScaleX = 1.05;
        break;
      }
      case 'RISE_UP': {
        const riseProg = Math.min(1, wordProgress * 3.5);
        animOffsetY = (1 - riseProg) * 24 * scale;
        animAlpha = riseProg;
        animScaleX = 1.05;
        animScaleY = 1.05;
        break;
      }
      case 'VARIETY_PUNCH': {
        const p = wordProgress;
        const s = p < 0.2 ? 1.0 + (p / 0.2) * 0.38 : (p < 0.4 ? 1.38 - ((p - 0.2) / 0.2) * 0.22 : 1.16);
        animScaleX = s;
        animScaleY = s;
        break;
      }
      case 'POP': {
        const s = wordProgress < 0.25 ? 1.0 + (wordProgress / 0.25) * 0.25 : 1.25 - ((wordProgress - 0.25) / 0.75) * 0.17;
        animScaleX = s;
        animScaleY = s;
        break;
      }
      default: {
        animScaleX = 1.08;
        animScaleY = 1.08;
        break;
      }
    }

    ctx.save();
    ctx.translate(centerX + animOffsetX, centerY + animOffsetY);
    ctx.scale(animScaleX, animScaleY);
    ctx.globalAlpha = animAlpha;

    if (animRotation) {
      ctx.rotate((animRotation * Math.PI) / 180);
    }

    // Single-word background pill
    if (config.wordHasBackground && config.colors.backgroundColor.length > 0) {
      const bgPadX = config.sizes.backgroundPaddingX * scale * 1.2;
      const bgPadY = config.sizes.backgroundPaddingY * scale * 1.2;
      const bgRadius = config.sizes.backgroundRadius * scale;
      const pillHeight = fontSize * 1.35;

      ctx.save();
      ctx.fillStyle = rgbToString(config.colors.backgroundColor[0]);
      ctx.beginPath();
      ctx.roundRect(
        -itemWidth / 2 - bgPadX,
        -pillHeight / 2 - (bgPadY / 2),
        itemWidth + (bgPadX * 2),
        pillHeight + bgPadY,
        bgRadius
      );
      ctx.fill();
      ctx.restore();
    }

    const textRelCenterX = (hasEmoji && !isEmojiAbove)
      ? (-itemWidth / 2) + (textWidth / 2)
      : 0;

    // Extruded 3D shadow layers
    if (config.modes.effectType === 'EXTRUDE_3D') {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.9)';
      for (let layer = 1; layer <= 5; layer++) {
        ctx.fillText(wordText, textRelCenterX + layer * 2.5 * scale, layer * 2.5 * scale);
      }
      ctx.restore();
    }

    // Shadow & glow
    if (config.wordHasShadow && config.colors.shadowColor.length > 0) {
      ctx.shadowColor = rgbToString(config.colors.shadowColor[0]);
      ctx.shadowBlur = currentGlowBlur;
      ctx.shadowOffsetX = 2 * scale;
      ctx.shadowOffsetY = 4 * scale;
    } else {
      ctx.shadowColor = 'transparent';
    }

    // Stroke
    if (strokeSize > 0 && config.colors.strokeColor.length > 0) {
      ctx.strokeStyle = rgbToString(config.colors.strokeColor[0]);
      ctx.lineWidth = strokeSize;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(wordText, textRelCenterX, 0);
    }

    // Glitch RGB split layers
    if (config.modes.effectType === 'GLITCH_RGB') {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 240, 255, 0.75)';
      ctx.fillText(wordText, textRelCenterX - 4 * scale, 0);
      ctx.fillStyle = 'rgba(255, 0, 80, 0.75)';
      ctx.fillText(wordText, textRelCenterX + 4 * scale, 0);
      ctx.restore();
    }

    // Fill color
    let textColor = rgbToString(config.colors.spokenColor[0] || config.colors.defaultColor[0]);
    if (config.modes.effectType === 'RAINBOW_CYCLE') {
      const hue = Math.floor((currentTime * 180) % 360);
      textColor = `hsl(${hue}, 100%, 65%)`;
    } else if (activeWord.highlight && config.colors.hilightColor.length > 0) {
      textColor = rgbToString(config.colors.hilightColor[0]);
    }

    ctx.fillStyle = textColor;
    ctx.fillText(wordText, textRelCenterX, 0);

    // Sparkles
    if (config.modes.effectType === 'SPARKLE_TWINKLE') {
      const spColor = rgbToString(config.colors.spokenColor[0] || { r: 255, g: 230, b: 0 });
      drawSparkle(ctx, textRelCenterX - textWidth / 2 - 10 * scale, -fontSize * 0.4, 8 * scale, spColor);
      drawSparkle(ctx, textRelCenterX + textWidth / 2 + 10 * scale, fontSize * 0.4, 6 * scale, spColor);
    }

    // Emoji beside or above
    if (hasEmoji && activeWord.emoji) {
      let emojiBounce = 0;
      let emojiScale = 1.0;
      if (config.emojiAnimated) {
        emojiBounce = -Math.abs(Math.sin(currentTime * 12)) * (10 * scale);
        emojiScale = 1.2;
      }
      ctx.save();
      ctx.shadowColor = 'transparent';
      if (isEmojiAbove) {
        ctx.translate(textRelCenterX, -(fontSize * 0.9) + emojiBounce);
      } else {
        const emojiRelCenterX = (-itemWidth / 2) + textWidth + emojiGap + (emojiSize / 2);
        ctx.translate(emojiRelCenterX, emojiBounce);
      }
      ctx.scale(emojiScale, emojiScale);
      ctx.font = `${emojiSize}px sans-serif`;
      ctx.fillText(activeWord.emoji, 0, 0);
      ctx.restore();
    }

    ctx.restore();
    ctx.restore();
    return;
  }

  // =========================================================================
  // STANDARD & MULTI-WORD DISPLAY MODE (with full animation spectrum)
  // =========================================================================
  const blocks = groupWordsIntoBlocks(words, config);
  const activeBlock = getActiveBlock(blocks, currentTime);

  if (!activeBlock || activeBlock.length === 0) {
    ctx.restore();
    return;
  }

  const lines: Word[][] = [];
  const wordsPerLine = Math.ceil(activeBlock.length / Math.min(config.linesCount, 2));
  for (let i = 0; i < activeBlock.length; i += wordsPerLine) {
    lines.push(activeBlock.slice(i, i + wordsPerLine));
  }

  const lineHeight = fontSize * 1.38;
  const totalHeight = lines.length * lineHeight;
  const centerY = (canvasHeight * (config.sizes.posY / 100)) - (totalHeight / 2);

  lines.forEach((lineWords, lineIdx) => {
    const lineY = centerY + (lineIdx * lineHeight);
    const spaceWidth = ctx.measureText(' ').width;

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
      const itemWidth = (hasEmoji && !isEmojiAbove)
        ? textWidth + emojiGap + emojiSize
        : textWidth;

      return { wordObj: w, wordText: text, textWidth, itemWidth, hasEmoji };
    });

    const totalLineWidth = wordLayouts.reduce((sum, item) => sum + item.itemWidth, 0) + (spaceWidth * (wordLayouts.length - 1));

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

    if (config.rotationAngle) {
      const lineCenterX = currentX + (totalLineWidth / 2);
      ctx.translate(lineCenterX, lineY);
      ctx.rotate((config.rotationAngle * Math.PI) / 180);
      ctx.translate(-lineCenterX, -lineY);
    }

    // Background pill
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

    // Render words
    wordLayouts.forEach((item) => {
      const { wordObj, wordText, textWidth, itemWidth, hasEmoji } = item;
      const isSpoken = currentTime >= wordObj.start && currentTime <= wordObj.end;
      const wordDur = Math.max(0.01, wordObj.end - wordObj.start);
      const wordProgress = Math.min(1, Math.max(0, (currentTime - wordObj.start) / wordDur));

      ctx.save();

      let animScaleX = 1.0;
      let animScaleY = 1.0;
      let animOffsetY = 0;
      let animOffsetX = 0;
      let animAlpha = 1.0;
      let currentGlowBlur = blurSize;
      let animRotation = 0;

      // Color selection
      let textColor = rgbToString(config.colors.defaultColor[0]);
      if (wordObj.highlight && config.colors.hilightColor.length > 0) {
        textColor = rgbToString(config.colors.hilightColor[0]);
      } else if (isSpoken && config.colors.spokenColor.length > 0) {
        textColor = rgbToString(config.colors.spokenColor[0]);
      }

      if (isSpoken) {
        switch (config.modes.effectType) {
          case 'SPRING_BOUNCE': {
            const decay = 4.5;
            const freq = 12;
            const bounce = Math.sin(wordProgress * freq) * Math.exp(-wordProgress * decay);
            const s = 1.0 + (1 - wordProgress) * 0.25 + bounce * 0.12;
            animScaleX = s;
            animScaleY = s;
            animOffsetY = -Math.abs(Math.sin(wordProgress * Math.PI)) * (8 * scale);
            break;
          }
          case 'GLOW_PULSE': {
            const pulse = (Math.sin(currentTime * 12) + 1) / 2;
            currentGlowBlur = blurSize + pulse * 20 * scale;
            animScaleX = 1.06 + pulse * 0.06;
            animScaleY = animScaleX;
            break;
          }
          case 'KARAOKE_WIPE': {
            // Handled in fill gradient below
            animScaleX = 1.04;
            animScaleY = 1.04;
            break;
          }
          case 'STRETCH_SNAP': {
            const snap = Math.sin(wordProgress * Math.PI);
            animScaleX = 1.0 - snap * 0.12;
            animScaleY = 1.0 + snap * 0.28;
            animOffsetY = -snap * 6 * scale;
            break;
          }
          case 'JITTER_SHAKE':
          case 'SHAKE': {
            animOffsetX = (Math.random() - 0.5) * 6 * scale;
            animOffsetY = (Math.random() - 0.5) * 6 * scale;
            animScaleX = 1.08;
            animScaleY = 1.08;
            break;
          }
          case 'SWAY_FLOAT': {
            animRotation = Math.sin(currentTime * 6) * 4;
            animOffsetY = Math.sin(currentTime * 8) * 5 * scale;
            break;
          }
          case 'FLIP_3D': {
            const flipProg = Math.min(1, wordProgress * 3);
            animScaleY = Math.max(0.05, Math.sin(flipProg * Math.PI * 0.5));
            break;
          }
          case 'RISE_UP': {
            const riseProg = Math.min(1, wordProgress * 3.0);
            animOffsetY = (1 - riseProg) * 16 * scale;
            animAlpha = riseProg;
            break;
          }
          case 'RAINBOW_CYCLE': {
            const hue = Math.floor((currentTime * 180) % 360);
            textColor = `hsl(${hue}, 100%, 65%)`;
            break;
          }
          case 'VARIETY_PUNCH': {
            const p = wordProgress;
            const s = p < 0.2 ? 1.0 + (p / 0.2) * 0.32 : (p < 0.4 ? 1.32 - ((p - 0.2) / 0.2) * 0.18 : 1.14);
            animScaleX = s;
            animScaleY = s;
            break;
          }
          case 'POP': {
            const s = wordProgress < 0.3 ? 1.0 + (wordProgress / 0.3) * 0.18 : 1.18 - ((wordProgress - 0.3) / 0.7) * 0.08;
            animScaleX = s;
            animScaleY = s;
            break;
          }
          case 'SMOOTH_POP': {
            animScaleX = 1.0 + Math.sin(wordProgress * Math.PI) * 0.12;
            animScaleY = animScaleX;
            animOffsetY = -Math.sin(wordProgress * Math.PI) * 6 * scale;
            break;
          }
          case 'GLITCH': {
            animScaleX = 1.08;
            animScaleY = 1.08;
            animOffsetX = Math.sin(currentTime * 30) * 5 * scale;
            break;
          }
          case 'FADE': {
            animAlpha = Math.min(1, wordProgress * 2.5);
            break;
          }
          default:
            animScaleX = 1.0;
            animScaleY = 1.0;
        }
      }

      const itemCenterX = currentX + (itemWidth / 2);
      ctx.translate(itemCenterX + animOffsetX, lineY + animOffsetY);
      ctx.scale(animScaleX, animScaleY);
      ctx.globalAlpha = animAlpha;

      if (animRotation) {
        ctx.rotate((animRotation * Math.PI) / 180);
      }

      const textRelCenterX = (hasEmoji && !isEmojiAbove)
        ? (-itemWidth / 2) + (textWidth / 2)
        : 0;

      // Extrude 3D
      if (config.modes.effectType === 'EXTRUDE_3D') {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        for (let layer = 1; layer <= 3; layer++) {
          ctx.fillText(wordText, textRelCenterX + layer * 2 * scale, layer * 2 * scale);
        }
        ctx.restore();
      }

      // Shadow & glow
      if (config.wordHasShadow && config.colors.shadowColor.length > 0) {
        ctx.shadowColor = rgbToString(config.colors.shadowColor[0]);
        ctx.shadowBlur = currentGlowBlur;
        ctx.shadowOffsetX = 2 * scale;
        ctx.shadowOffsetY = 4 * scale;
      } else {
        ctx.shadowColor = 'transparent';
      }

      // Stroke
      if (strokeSize > 0 && config.colors.strokeColor.length > 0) {
        ctx.strokeStyle = rgbToString(config.colors.strokeColor[0]);
        ctx.lineWidth = strokeSize;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(wordText, textRelCenterX, 0);
      }

      // Glitch RGB split
      if (isSpoken && config.modes.effectType === 'GLITCH_RGB') {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
        ctx.fillText(wordText, textRelCenterX - 3 * scale, 0);
        ctx.fillStyle = 'rgba(255, 0, 80, 0.7)';
        ctx.fillText(wordText, textRelCenterX + 3 * scale, 0);
        ctx.restore();
      }

      // Karaoke Wipe Gradient
      if (isSpoken && config.modes.effectType === 'KARAOKE_WIPE') {
        const wipeGrad = ctx.createLinearGradient(
          textRelCenterX - textWidth / 2, 0,
          textRelCenterX + textWidth / 2, 0
        );
        const spokenC = rgbToString(config.colors.spokenColor[0]);
        const defaultC = rgbToString(config.colors.defaultColor[0]);
        wipeGrad.addColorStop(0, spokenC);
        wipeGrad.addColorStop(Math.min(1, wordProgress), spokenC);
        wipeGrad.addColorStop(Math.min(1, wordProgress + 0.05), defaultC);
        wipeGrad.addColorStop(1, defaultC);
        ctx.fillStyle = wipeGrad;
      } else {
        ctx.fillStyle = textColor;
      }

      ctx.fillText(wordText, textRelCenterX, 0);

      // Sparkle
      if (isSpoken && config.modes.effectType === 'SPARKLE_TWINKLE') {
        const spColor = rgbToString(config.colors.spokenColor[0] || { r: 255, g: 230, b: 0 });
        drawSparkle(ctx, textRelCenterX - textWidth / 2 - 8 * scale, -fontSize * 0.35, 6 * scale, spColor);
      }

      // Emojis
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

    ctx.restore();
  });

  ctx.restore();
}
