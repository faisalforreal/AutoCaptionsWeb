import { TemplateConfig } from '../types';

export const VIRAL_PRESETS: TemplateConfig[] = [
  {
    id: 'hormozi-bold',
    name: 'Hormozi Bold',
    description: 'Viral high-energy business style with bold uppercase and yellow spoken highlight',
    category: 'creator',
    font: { name: 'The Bold', weight: 900, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 255, b: 255 }],
      spokenColor: [{ r: 255, g: 230, b: 0 }], // #FFE600
      hilightColor: [{ r: 0, g: 255, b: 102 }],
      strokeColor: [{ r: 0, g: 0, b: 0 }],
      backgroundColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.9 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'PUNCTUATION',
      spokenMode: 'WORD',
      effectType: 'POP',
      emojiEffect: 'DEFAULT'
    },
    sizes: {
      fontSize: 52,
      strokeSize: 14,
      blurSize: 8,
      emojiSize: 56,
      backgroundRadius: 10,
      backgroundPaddingX: 14,
      backgroundPaddingY: 8,
      posY: 75
    },
    linesCount: 1,
    wordsPerLineCount: 3,
    wordHasBackground: false,
    wordHasPunctuation: true,
    wordHasShadow: true,
    emojiAnimated: true,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'mrbeast-pop',
    name: 'MrBeast Explosive',
    description: 'Energetic pop animation with thick comic stroke and animated emojis',
    category: 'viral',
    font: { name: 'Komika Axis', weight: 900, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 255, b: 255 }],
      spokenColor: [{ r: 43, g: 248, b: 42 }], // #2BF82A
      hilightColor: [{ r: 253, g: 250, b: 20 }],
      strokeColor: [{ r: 0, g: 0, b: 0 }],
      backgroundColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.85 }]
    },
    modes: {
      displayMode: 'WORD',
      displayWords: 'FIXED',
      spokenMode: 'WORD',
      effectType: 'POP',
      emojiEffect: 'SLIDE'
    },
    sizes: {
      fontSize: 56,
      strokeSize: 16,
      blurSize: 10,
      emojiSize: 64,
      backgroundRadius: 12,
      backgroundPaddingX: 16,
      backgroundPaddingY: 10,
      posY: 72
    },
    linesCount: 1,
    wordsPerLineCount: 2,
    wordHasBackground: false,
    wordHasPunctuation: false,
    wordHasShadow: true,
    emojiAnimated: true,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'ali-abdaal-clean',
    name: 'Ali Abdaal Clean',
    description: 'Sophisticated minimalist look with dark rounded pill backdrop and smooth fade',
    category: 'minimal',
    font: { name: 'Montserrat', weight: 700, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 245, g: 245, b: 247 }],
      spokenColor: [{ r: 56, g: 189, b: 248 }], // Sky Blue
      hilightColor: [{ r: 255, g: 255, b: 255 }],
      strokeColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      backgroundColor: [{ r: 15, g: 15, b: 26, a: 0.85 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.4 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'PUNCTUATION',
      spokenMode: 'WORD',
      effectType: 'FADE',
      emojiEffect: 'DEFAULT'
    },
    sizes: {
      fontSize: 38,
      strokeSize: 0,
      blurSize: 6,
      emojiSize: 42,
      backgroundRadius: 14,
      backgroundPaddingX: 20,
      backgroundPaddingY: 12,
      posY: 80
    },
    linesCount: 2,
    wordsPerLineCount: 4,
    wordHasBackground: true,
    wordHasPunctuation: true,
    wordHasShadow: true,
    emojiAnimated: false,
    capitalizationType: 'DEFAULT'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'Futuristic glowing cyan and neon pink captions for gaming and tech',
    category: 'bold',
    font: { name: 'Heavitas', weight: 900, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 0, g: 240, b: 255 }], // Electric Cyan
      spokenColor: [{ r: 255, g: 0, b: 128 }],  // Neon Pink
      hilightColor: [{ r: 255, g: 255, b: 0 }],
      strokeColor: [{ r: 10, g: 10, b: 30 }],
      backgroundColor: [{ r: 5, g: 5, b: 15, a: 0.7 }],
      shadowColor: [{ r: 0, g: 240, b: 255, a: 0.9 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'FIXED',
      spokenMode: 'WORD',
      effectType: 'GLITCH',
      emojiEffect: 'SHAKE'
    },
    sizes: {
      fontSize: 48,
      strokeSize: 10,
      blurSize: 18,
      emojiSize: 52,
      backgroundRadius: 8,
      backgroundPaddingX: 16,
      backgroundPaddingY: 10,
      posY: 75
    },
    linesCount: 1,
    wordsPerLineCount: 3,
    wordHasBackground: true,
    wordHasPunctuation: false,
    wordHasShadow: true,
    emojiAnimated: true,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'dev-minimal',
    name: 'Dev / Code Pill',
    description: 'Monospace terminal pill style favored by developers and tech educators',
    category: 'minimal',
    font: { name: 'Roboto', weight: 700, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 220, g: 220, b: 230 }],
      spokenColor: [{ r: 16, g: 185, b: 129 }], // Emerald #10B981
      hilightColor: [{ r: 245, g: 158, b: 11 }],
      strokeColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      backgroundColor: [{ r: 20, g: 20, b: 35, a: 0.9 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.6 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'PUNCTUATION',
      spokenMode: 'WORD',
      effectType: 'SMOOTH_POP',
      emojiEffect: 'DEFAULT'
    },
    sizes: {
      fontSize: 36,
      strokeSize: 0,
      blurSize: 8,
      emojiSize: 40,
      backgroundRadius: 10,
      backgroundPaddingX: 18,
      backgroundPaddingY: 10,
      posY: 80
    },
    linesCount: 2,
    wordsPerLineCount: 5,
    wordHasBackground: true,
    wordHasPunctuation: true,
    wordHasShadow: true,
    emojiAnimated: false,
    capitalizationType: 'DEFAULT'
  },
  {
    id: 'karaoke-gold',
    name: 'Karaoke Gold',
    description: 'Classic musical lyric progression with dim inactive text wiped by gold highlight',
    category: 'creator',
    font: { name: 'Built Titling', weight: 800, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 140, g: 140, b: 155 }],
      spokenColor: [{ r: 255, g: 215, b: 0 }], // Gold
      hilightColor: [{ r: 255, g: 255, b: 255 }],
      strokeColor: [{ r: 0, g: 0, b: 0 }],
      backgroundColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.75 }]
    },
    modes: {
      displayMode: 'ALL',
      displayWords: 'PUNCTUATION',
      spokenMode: 'WORD',
      effectType: 'SMOOTH_POP',
      emojiEffect: 'DEFAULT'
    },
    sizes: {
      fontSize: 44,
      strokeSize: 10,
      blurSize: 6,
      emojiSize: 48,
      backgroundRadius: 8,
      backgroundPaddingX: 14,
      backgroundPaddingY: 8,
      posY: 75
    },
    linesCount: 2,
    wordsPerLineCount: 4,
    wordHasBackground: false,
    wordHasPunctuation: true,
    wordHasShadow: true,
    emojiAnimated: false,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'luxury-editorial',
    name: 'Luxury Editorial',
    description: 'High-end serif aesthetic suited for luxury branding, fashion, and cinema',
    category: 'creator',
    font: { name: 'Instrument Serif', weight: 400, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 245, g: 245, b: 240 }],
      spokenColor: [{ r: 212, g: 175, b: 55 }], // Champagne Gold
      hilightColor: [{ r: 255, g: 255, b: 255 }],
      strokeColor: [{ r: 0, g: 0, b: 0, a: 0.5 }],
      backgroundColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.5 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'PUNCTUATION',
      spokenMode: 'WORD',
      effectType: 'FADE',
      emojiEffect: 'DISABLED'
    },
    sizes: {
      fontSize: 48,
      strokeSize: 4,
      blurSize: 6,
      emojiSize: 44,
      backgroundRadius: 6,
      backgroundPaddingX: 16,
      backgroundPaddingY: 8,
      posY: 78
    },
    linesCount: 1,
    wordsPerLineCount: 4,
    wordHasBackground: false,
    wordHasPunctuation: true,
    wordHasShadow: true,
    emojiAnimated: false,
    capitalizationType: 'DEFAULT'
  },
  {
    id: 'glitch-beast',
    name: 'Glitch Beast',
    description: 'Intense crimson and neon yellow style with high-energy vibration',
    category: 'bold',
    font: { name: 'Anton', weight: 900, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 255, b: 255 }],
      spokenColor: [{ r: 255, g: 30, b: 30 }], // Crimson Red
      hilightColor: [{ r: 255, g: 240, b: 0 }],
      strokeColor: [{ r: 0, g: 0, b: 0 }],
      backgroundColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      shadowColor: [{ r: 255, g: 0, b: 0, a: 0.8 }]
    },
    modes: {
      displayMode: 'WORD',
      displayWords: 'FIXED',
      spokenMode: 'WORD',
      effectType: 'SHAKE',
      emojiEffect: 'SHAKE'
    },
    sizes: {
      fontSize: 60,
      strokeSize: 14,
      blurSize: 12,
      emojiSize: 60,
      backgroundRadius: 8,
      backgroundPaddingX: 14,
      backgroundPaddingY: 8,
      posY: 70
    },
    linesCount: 1,
    wordsPerLineCount: 2,
    wordHasBackground: false,
    wordHasPunctuation: false,
    wordHasShadow: true,
    emojiAnimated: true,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'tiktok-bouncy',
    name: 'TikTok Bouncy',
    description: 'Playful pastel purple style with bouncy word animations',
    category: 'viral',
    font: { name: 'Lemon Milk', weight: 800, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 255, b: 255 }],
      spokenColor: [{ r: 168, g: 85, b: 247 }], // Pastel Purple #A855F7
      hilightColor: [{ r: 251, g: 191, b: 36 }],
      strokeColor: [{ r: 20, g: 10, b: 40 }],
      backgroundColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.8 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'PUNCTUATION',
      spokenMode: 'WORD',
      effectType: 'WAVE_SCALE',
      emojiEffect: 'VERTICAL_FLIP'
    },
    sizes: {
      fontSize: 46,
      strokeSize: 12,
      blurSize: 8,
      emojiSize: 52,
      backgroundRadius: 10,
      backgroundPaddingX: 16,
      backgroundPaddingY: 8,
      posY: 74
    },
    linesCount: 1,
    wordsPerLineCount: 3,
    wordHasBackground: false,
    wordHasPunctuation: false,
    wordHasShadow: true,
    emojiAnimated: true,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'retro-wave',
    name: 'Retro Wave 80s',
    description: 'Vibrant sunset orange and neon fuchsia with double offset shadow',
    category: 'bold',
    font: { name: 'Komika Axis', weight: 800, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 245, b: 230 }],
      spokenColor: [{ r: 255, g: 122, b: 0 }], // Bright Orange
      hilightColor: [{ r: 255, g: 0, b: 128 }], // Hot Pink
      strokeColor: [{ r: 40, g: 10, b: 30 }],
      backgroundColor: [{ r: 10, g: 5, b: 20, a: 0.7 }],
      shadowColor: [{ r: 255, g: 0, b: 128, a: 0.8 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'FIXED',
      spokenMode: 'WORD',
      effectType: 'POP',
      emojiEffect: 'HORIZONTAL_FLIP'
    },
    sizes: {
      fontSize: 48,
      strokeSize: 10,
      blurSize: 12,
      emojiSize: 52,
      backgroundRadius: 10,
      backgroundPaddingX: 16,
      backgroundPaddingY: 8,
      posY: 76
    },
    linesCount: 1,
    wordsPerLineCount: 3,
    wordHasBackground: true,
    wordHasPunctuation: false,
    wordHasShadow: true,
    emojiAnimated: true,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'news-alert',
    name: 'Breaking News',
    description: 'High urgency broadcast red backdrop bar with crisp white bold text',
    category: 'bold',
    font: { name: 'Roboto Condensed', weight: 900, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 255, b: 255 }],
      spokenColor: [{ r: 255, g: 235, b: 0 }], // Yellow
      hilightColor: [{ r: 255, g: 255, b: 255 }],
      strokeColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      backgroundColor: [{ r: 220, g: 38, b: 38, a: 0.95 }], // Alert Red
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.6 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'PUNCTUATION',
      spokenMode: 'LINE',
      effectType: 'DISABLED',
      emojiEffect: 'SHAKE'
    },
    sizes: {
      fontSize: 40,
      strokeSize: 0,
      blurSize: 6,
      emojiSize: 44,
      backgroundRadius: 4,
      backgroundPaddingX: 20,
      backgroundPaddingY: 10,
      posY: 82
    },
    linesCount: 1,
    wordsPerLineCount: 4,
    wordHasBackground: true,
    wordHasPunctuation: true,
    wordHasShadow: true,
    emojiAnimated: false,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'comic-pop',
    name: 'Comic Pop',
    description: 'Graphic comic novel typography with ink line accents',
    category: 'creator',
    font: { name: 'Komika Axis', weight: 900, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 255, b: 255 }],
      spokenColor: [{ r: 255, g: 230, b: 0 }],
      hilightColor: [{ r: 255, g: 50, b: 50 }],
      strokeColor: [{ r: 0, g: 0, b: 0 }],
      backgroundColor: [{ r: 255, g: 255, b: 255, a: 0 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.9 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'FIXED',
      spokenMode: 'WORD',
      effectType: 'POP',
      emojiEffect: 'DEFAULT'
    },
    sizes: {
      fontSize: 50,
      strokeSize: 14,
      blurSize: 8,
      emojiSize: 54,
      backgroundRadius: 8,
      backgroundPaddingX: 16,
      backgroundPaddingY: 8,
      posY: 74
    },
    linesCount: 1,
    wordsPerLineCount: 3,
    wordHasBackground: false,
    wordHasPunctuation: true,
    wordHasShadow: true,
    emojiAnimated: true,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'cinema-subtitle',
    name: 'Cinema Classic',
    description: 'Standard film & documentary yellow subtitle with dark soft bounding stroke',
    category: 'minimal',
    font: { name: 'Roboto', weight: 500, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 242, b: 0 }], // #FFF200
      spokenColor: [{ r: 255, g: 255, b: 255 }],
      hilightColor: [{ r: 255, g: 242, b: 0 }],
      strokeColor: [{ r: 0, g: 0, b: 0, a: 0.8 }],
      backgroundColor: [{ r: 0, g: 0, b: 0, a: 0.4 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.7 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'PUNCTUATION',
      spokenMode: 'LINE',
      effectType: 'DISABLED',
      emojiEffect: 'DISABLED'
    },
    sizes: {
      fontSize: 34,
      strokeSize: 6,
      blurSize: 4,
      emojiSize: 36,
      backgroundRadius: 6,
      backgroundPaddingX: 14,
      backgroundPaddingY: 6,
      posY: 84
    },
    linesCount: 2,
    wordsPerLineCount: 6,
    wordHasBackground: true,
    wordHasPunctuation: true,
    wordHasShadow: true,
    emojiAnimated: false,
    capitalizationType: 'DEFAULT'
  },
  {
    id: 'gradient-flow',
    name: 'Gradient Flow',
    description: 'Multi-hue vibrant violet-to-fuchsia modern social style',
    category: 'viral',
    font: { name: 'Montserrat', weight: 900, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 255, b: 255 }],
      spokenColor: [{ r: 236, g: 72, b: 153 }], // Pink #EC4899
      hilightColor: [{ r: 139, g: 92, b: 246 }], // Violet #8B5CF6
      strokeColor: [{ r: 20, g: 10, b: 35 }],
      backgroundColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      shadowColor: [{ r: 139, g: 92, b: 246, a: 0.8 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'FIXED',
      spokenMode: 'WORD',
      effectType: 'SMOOTH_POP',
      emojiEffect: 'DEFAULT'
    },
    sizes: {
      fontSize: 50,
      strokeSize: 12,
      blurSize: 14,
      emojiSize: 54,
      backgroundRadius: 10,
      backgroundPaddingX: 16,
      backgroundPaddingY: 8,
      posY: 75
    },
    linesCount: 1,
    wordsPerLineCount: 3,
    wordHasBackground: false,
    wordHasPunctuation: false,
    wordHasShadow: true,
    emojiAnimated: true,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'one-word-rapid',
    name: 'One Word Rapid',
    description: 'Maximal retention single-word rapid succession on center screen',
    category: 'viral',
    font: { name: 'The Bold', weight: 900, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 255, b: 255 }],
      spokenColor: [{ r: 0, g: 255, b: 136 }], // Neon Mint
      hilightColor: [{ r: 255, g: 230, b: 0 }],
      strokeColor: [{ r: 0, g: 0, b: 0 }],
      backgroundColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.9 }]
    },
    modes: {
      displayMode: 'WORD',
      displayWords: 'FIXED',
      spokenMode: 'WORD',
      effectType: 'POP',
      emojiEffect: 'SLIDE'
    },
    sizes: {
      fontSize: 64,
      strokeSize: 18,
      blurSize: 12,
      emojiSize: 68,
      backgroundRadius: 12,
      backgroundPaddingX: 18,
      backgroundPaddingY: 10,
      posY: 55 // Centered
    },
    linesCount: 1,
    wordsPerLineCount: 1,
    wordHasBackground: false,
    wordHasPunctuation: false,
    wordHasShadow: true,
    emojiAnimated: true,
    capitalizationType: 'UPPERCASE'
  },
  {
    id: 'custom-preset',
    name: 'Custom Preset',
    description: 'Fully customizable user template',
    category: 'creator',
    font: { name: 'Montserrat', weight: 800, direction: 'LTR' },
    colors: {
      defaultColor: [{ r: 255, g: 255, b: 255 }],
      spokenColor: [{ r: 139, g: 92, b: 246 }],
      hilightColor: [{ r: 255, g: 230, b: 0 }],
      strokeColor: [{ r: 0, g: 0, b: 0 }],
      backgroundColor: [{ r: 0, g: 0, b: 0, a: 0 }],
      shadowColor: [{ r: 0, g: 0, b: 0, a: 0.8 }]
    },
    modes: {
      displayMode: 'LINE',
      displayWords: 'PUNCTUATION',
      spokenMode: 'WORD',
      effectType: 'POP',
      emojiEffect: 'DEFAULT'
    },
    sizes: {
      fontSize: 48,
      strokeSize: 12,
      blurSize: 8,
      emojiSize: 52,
      backgroundRadius: 10,
      backgroundPaddingX: 16,
      backgroundPaddingY: 8,
      posY: 75
    },
    linesCount: 1,
    wordsPerLineCount: 3,
    wordHasBackground: false,
    wordHasPunctuation: true,
    wordHasShadow: true,
    emojiAnimated: true,
    capitalizationType: 'UPPERCASE'
  }
];
