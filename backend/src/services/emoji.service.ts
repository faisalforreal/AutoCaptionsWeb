import { Word } from '../types';

const emojiMap: Record<string, string> = {
  // Money & Wealth
  money: '💸',
  cash: '💵',
  dollar: '💵',
  dollars: '💵',
  rich: '🤑',
  wealth: '💰',
  wealthy: '💰',
  profit: '📈',
  revenue: '📈',
  crypto: '🪙',
  bitcoin: '₿',
  expensive: '💎',
  invest: '📊',
  investing: '📊',
  business: '💼',
  millionaire: '💰',
  billionaire: '🚀',

  // Fire, energy & hype
  fire: '🔥',
  lit: '🔥',
  hot: '🔥',
  insane: '🤯',
  crazy: '🤪',
  mindblown: '🤯',
  blow: '💥',
  explode: '💥',
  viral: '🚀',
  rocket: '🚀',
  energy: '⚡',
  power: '⚡',
  fast: '⚡',
  speed: '🏎️',

  // Success & Winning
  win: '🏆',
  winner: '🏆',
  winning: '🏆',
  champion: '🥇',
  first: '🥇',
  success: '🎯',
  successful: '🎯',
  goal: '⚽',
  target: '🎯',
  perfect: '✨',
  best: '👑',
  king: '👑',
  queen: '👑',
  boss: '🕶️',

  // Love & Emotion
  love: '❤️',
  loved: '❤️',
  heart: '💖',
  like: '👍',
  happy: '😄',
  smile: '😊',
  laugh: '😂',
  funny: '🤣',
  cry: '😭',
  sad: '😢',
  angry: '😡',
  shocked: '😱',
  scary: '👻',
  fear: '😨',

  // Mind, Brain & Knowledge
  brain: '🧠',
  mind: '🧠',
  think: '🤔',
  thinking: '🤔',
  smart: '💡',
  idea: '💡',
  secret: '🤫',
  learn: '📚',
  study: '📖',
  truth: '🔎',
  fact: '📌',

  // Actions & Gestures
  stop: '🛑',
  danger: '⚠️',
  warning: '🚨',
  alert: '🚨',
  look: '👀',
  watch: '👀',
  listen: '👂',
  speak: '🗣️',
  talk: '💬',
  clap: '👏',
  magic: '🪄',
  star: '⭐',

  // Time & Tech
  time: '⏰',
  clock: '⏳',
  day: '☀️',
  night: '🌙',
  world: '🌍',
  earth: '🌎',
  ai: '🤖',
  robot: '🤖',
  code: '💻',
  computer: '💻',
  phone: '📱',
  video: '🎬',
  camera: '📸',
  music: '🎵',
  song: '🎶'
};

export class EmojiService {
  /**
   * Annotate words with contextual emojis
   */
  public static enrichWords(words: Word[]): Word[] {
    return words.map((word) => {
      // Clean word from punctuation and lowercase
      const clean = word.word.toLowerCase().replace(/[^a-z0-9]/g, '');
      const emoji = emojiMap[clean];
      if (emoji) {
        return {
          ...word,
          emoji
        };
      }
      return word;
    });
  }

  /**
   * Get emoji for a single word
   */
  public static getEmojiForWord(word: string): string | undefined {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    return emojiMap[clean];
  }
}
