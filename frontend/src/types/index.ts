export interface Word {
  start: number; // in seconds, e.g. 1.24
  end: number;   // in seconds, e.g. 1.68
  word: string;
  punctuated_word: string;
  confidence?: number;
  speaker?: number;
  emoji?: string;
  highlight?: boolean;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export type DisplayMode = 'ALL' | 'LINE' | 'WORD';
export type OrganizeWordsMode = 'PUNCTUATION' | 'FIXED';
export type SpokenMode = 'LINE' | 'WORD';
export type EffectType =
  | 'DISABLED'
  | 'POP'
  | 'SMOOTH_POP'
  | 'SPRING_BOUNCE'
  | 'GLOW_PULSE'
  | 'COLOR_SHIFT'
  | 'KARAOKE_WIPE'
  | 'JITTER_SHAKE'
  | 'STRETCH_SNAP'
  | 'GLITCH_RGB'
  | 'SWAY_FLOAT'
  | 'FLIP_3D'
  | 'RISE_UP'
  | 'TYPEWRITER'
  | 'EXTRUDE_3D'
  | 'RAINBOW_CYCLE'
  | 'SPARKLE_TWINKLE'
  | 'SMOKE_FADE'
  | 'LYRIC_ROLL'
  | 'VARIETY_PUNCH'
  | 'FADE'
  | 'FONT'
  | 'BIG'
  | 'SHAKE'
  | 'GLITCH'
  | 'WAVE_SCALE';
export type CapitalizationType = 'DEFAULT' | 'UPPERCASE' | 'LOWERCASE';
export type EmojiEffectType = 'DISABLED' | 'DEFAULT' | 'SLIDE' | 'SHAKE' | 'HORIZONTAL_FLIP' | 'VERTICAL_FLIP';
export type AspectRatio = '9:16' | '1:1' | '16:9' | '4:5';

export type TemplateCategory = 'viral' | 'minimal' | 'bold' | 'creator' | 'glow' | 'retro' | 'karaoke' | 'lyrics';

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags?: string[];
  font: {
    name: string;
    weight: number;
    direction?: 'LTR' | 'RTL';
  };
  colors: {
    defaultColor: RGBColor[];
    spokenColor: RGBColor[];
    hilightColor: RGBColor[];
    strokeColor: RGBColor[];
    backgroundColor: RGBColor[];
    shadowColor: RGBColor[];
  };
  modes: {
    displayMode: DisplayMode;
    displayWords: OrganizeWordsMode;
    spokenMode: SpokenMode;
    effectType: EffectType;
    emojiEffect: EmojiEffectType;
  };
  sizes: {
    fontSize: number;
    strokeSize: number;
    blurSize: number;
    emojiSize: number;
    backgroundRadius: number;
    backgroundPaddingX: number;
    backgroundPaddingY: number;
    posY: number; // percentage from top (e.g. 75)
    lineHeight?: number;
  };
  linesCount: number;
  wordsPerLineCount: number;
  wordHasBackground: boolean;
  wordHasPunctuation: boolean;
  wordHasShadow: boolean;
  emojiAnimated: boolean;
  capitalizationType: CapitalizationType;
  textAlign?: 'left' | 'center' | 'right';
  rotationAngle?: number;
  emojiPosition?: 'BESIDE' | 'ABOVE';
}

export interface VideoMetadata {
  name: string;
  duration: number;
  width: number;
  height: number;
  aspectRatio: number;
  fps: number;
}

export interface TranscriptionResponse {
  words: Word[];
  duration: number;
  language: string;
  confidence: number;
}
