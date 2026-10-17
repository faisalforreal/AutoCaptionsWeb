import { create } from 'zustand';
import { get as getFromIdb, set as setToIdb, del as delFromIdb } from 'idb-keyval';
import { AspectRatio, TemplateConfig, Word } from '../types';
import { VIRAL_PRESETS } from '../engine/presets';

const STORAGE_KEY_META = 'autocaption_project_meta_v1';
const IDB_KEY_VIDEO = 'autocaption_project_video_v1';

export const DEMO_WORDS: Word[] = [
  { start: 0.1, end: 0.45, word: 'This', punctuated_word: 'This' },
  { start: 0.46, end: 0.72, word: 'is', punctuated_word: 'is' },
  { start: 0.73, end: 1.15, word: 'how', punctuated_word: 'how' },
  { start: 1.16, end: 1.48, word: 'top', punctuated_word: 'top' },
  { start: 1.49, end: 1.95, word: 'creators', punctuated_word: 'creators', emoji: '👑' },
  { start: 2.05, end: 2.38, word: 'make', punctuated_word: 'make' },
  { start: 2.39, end: 2.75, word: 'viral', punctuated_word: 'viral', highlight: true },
  { start: 2.76, end: 3.25, word: 'videos', punctuated_word: 'videos!', emoji: '🚀' },
  { start: 3.35, end: 3.65, word: 'in', punctuated_word: 'in' },
  { start: 3.66, end: 4.10, word: 'seconds', punctuated_word: 'seconds.', emoji: '⚡' },
  { start: 4.25, end: 4.65, word: 'Try', punctuated_word: 'Try' },
  { start: 4.66, end: 4.95, word: 'all', punctuated_word: 'all' },
  { start: 4.96, end: 5.45, word: 'sixteen', punctuated_word: 'sixteen' },
  { start: 5.46, end: 6.10, word: 'styles', punctuated_word: 'styles!', emoji: '🔥' }
];

interface PersistedMetadata {
  projectName: string;
  aspectRatio: AspectRatio;
  duration: number;
  config: TemplateConfig;
  words: Word[];
  hasCustomVideo: boolean;
}

interface EditorState {
  // Project State
  projectName: string;
  aspectRatio: AspectRatio;
  config: TemplateConfig;
  words: Word[];
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  selectedWordIndex: number | null;
  activeSidebarTab: 'templates' | 'transcript' | 'style';

  // Video State
  videoFile: File | Blob | null;
  videoUrl: string;

  // Status & Init
  isTranscribing: boolean;
  uploadStatus: string;
  isInitialized: boolean;
  hasCustomVideo: boolean;

  // Actions
  setProjectName: (name: string) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setConfig: (config: TemplateConfig) => void;
  updateConfig: (updated: Partial<TemplateConfig>) => void;
  setWords: (words: Word[]) => void;
  updateWord: (index: number, updated: Partial<Word>) => void;
  deleteWord: (index: number) => void;
  batchUpdateWords: (newWords: Word[]) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSelectedWordIndex: (index: number | null) => void;
  setActiveSidebarTab: (tab: 'templates' | 'transcript' | 'style') => void;
  setIsTranscribing: (isTranscribing: boolean) => void;
  setUploadStatus: (status: string) => void;

  // Video File Management
  setVideoData: (file: File | Blob, projectName: string) => Promise<void>;
  loadDemoProject: () => void;
  resetProject: () => Promise<void>;
  initFromStorage: () => Promise<void>;
}

function saveMetaToStorage(meta: PersistedMetadata) {
  try {
    localStorage.setItem(STORAGE_KEY_META, JSON.stringify(meta));
  } catch (err) {
    console.warn('Failed to save project metadata to localStorage:', err);
  }
}

export const useEditorStore = create<EditorState>((set, get) => ({
  projectName: 'My Viral Reel',
  aspectRatio: '9:16',
  config: VIRAL_PRESETS[0],
  words: DEMO_WORDS,
  duration: 6.5,
  currentTime: 0,
  isPlaying: false,
  selectedWordIndex: null,
  activeSidebarTab: 'templates',
  videoFile: null,
  videoUrl: '',
  isTranscribing: false,
  uploadStatus: '',
  isInitialized: false,
  hasCustomVideo: false,

  setProjectName: (projectName) => {
    set({ projectName });
    const s = get();
    saveMetaToStorage({
      projectName,
      aspectRatio: s.aspectRatio,
      duration: s.duration,
      config: s.config,
      words: s.words,
      hasCustomVideo: s.hasCustomVideo
    });
  },

  setAspectRatio: (aspectRatio) => {
    set({ aspectRatio });
    const s = get();
    saveMetaToStorage({
      projectName: s.projectName,
      aspectRatio,
      duration: s.duration,
      config: s.config,
      words: s.words,
      hasCustomVideo: s.hasCustomVideo
    });
  },

  setConfig: (config) => {
    set({ config });
    const s = get();
    saveMetaToStorage({
      projectName: s.projectName,
      aspectRatio: s.aspectRatio,
      duration: s.duration,
      config,
      words: s.words,
      hasCustomVideo: s.hasCustomVideo
    });
  },

  updateConfig: (updated) => {
    set((state) => {
      const newConfig = { ...state.config, ...updated };
      saveMetaToStorage({
        projectName: state.projectName,
        aspectRatio: state.aspectRatio,
        duration: state.duration,
        config: newConfig,
        words: state.words,
        hasCustomVideo: state.hasCustomVideo
      });
      return { config: newConfig };
    });
  },

  setWords: (words) => {
    set({ words });
    const s = get();
    saveMetaToStorage({
      projectName: s.projectName,
      aspectRatio: s.aspectRatio,
      duration: s.duration,
      config: s.config,
      words,
      hasCustomVideo: s.hasCustomVideo
    });
  },

  updateWord: (index, updated) => {
    set((state) => {
      const copy = [...state.words];
      copy[index] = { ...copy[index], ...updated };
      saveMetaToStorage({
        projectName: state.projectName,
        aspectRatio: state.aspectRatio,
        duration: state.duration,
        config: state.config,
        words: copy,
        hasCustomVideo: state.hasCustomVideo
      });
      return { words: copy };
    });
  },

  deleteWord: (index) => {
    set((state) => {
      const filtered = state.words.filter((_, i) => i !== index);
      saveMetaToStorage({
        projectName: state.projectName,
        aspectRatio: state.aspectRatio,
        duration: state.duration,
        config: state.config,
        words: filtered,
        hasCustomVideo: state.hasCustomVideo
      });
      return { words: filtered };
    });
  },

  batchUpdateWords: (newWords) => {
    set({ words: newWords });
    const s = get();
    saveMetaToStorage({
      projectName: s.projectName,
      aspectRatio: s.aspectRatio,
      duration: s.duration,
      config: s.config,
      words: newWords,
      hasCustomVideo: s.hasCustomVideo
    });
  },

  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => {
    set({ duration });
    const s = get();
    saveMetaToStorage({
      projectName: s.projectName,
      aspectRatio: s.aspectRatio,
      duration,
      config: s.config,
      words: s.words,
      hasCustomVideo: s.hasCustomVideo
    });
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSelectedWordIndex: (selectedWordIndex) => set({ selectedWordIndex }),
  setActiveSidebarTab: (activeSidebarTab) => set({ activeSidebarTab }),
  setIsTranscribing: (isTranscribing) => set({ isTranscribing }),
  setUploadStatus: (uploadStatus) => set({ uploadStatus }),

  setVideoData: async (file, projectName) => {
    // Revoke old URL if existing
    const oldUrl = get().videoUrl;
    if (oldUrl && oldUrl.startsWith('blob:')) {
      URL.revokeObjectURL(oldUrl);
    }

    const url = URL.createObjectURL(file);
    set({
      videoFile: file,
      videoUrl: url,
      projectName,
      hasCustomVideo: true
    });

    // Save video Blob to IndexedDB for persistent reload
    try {
      await setToIdb(IDB_KEY_VIDEO, file);
    } catch (err) {
      console.warn('Failed to save video file to IndexedDB:', err);
    }

    const s = get();
    saveMetaToStorage({
      projectName,
      aspectRatio: s.aspectRatio,
      duration: s.duration,
      config: s.config,
      words: s.words,
      hasCustomVideo: true
    });
  },

  loadDemoProject: () => {
    const oldUrl = get().videoUrl;
    if (oldUrl && oldUrl.startsWith('blob:')) {
      URL.revokeObjectURL(oldUrl);
    }

    set({
      videoFile: null,
      videoUrl: '',
      words: DEMO_WORDS,
      duration: 6.5,
      projectName: 'Demo Viral Reel (16 Styles)',
      hasCustomVideo: false
    });

    const s = get();
    saveMetaToStorage({
      projectName: 'Demo Viral Reel (16 Styles)',
      aspectRatio: s.aspectRatio,
      duration: 6.5,
      config: s.config,
      words: DEMO_WORDS,
      hasCustomVideo: false
    });

    delFromIdb(IDB_KEY_VIDEO).catch(() => {});
  },

  resetProject: async () => {
    const oldUrl = get().videoUrl;
    if (oldUrl && oldUrl.startsWith('blob:')) {
      URL.revokeObjectURL(oldUrl);
    }

    localStorage.removeItem(STORAGE_KEY_META);
    await delFromIdb(IDB_KEY_VIDEO).catch(() => {});

    set({
      projectName: 'My Viral Reel',
      aspectRatio: '9:16',
      config: VIRAL_PRESETS[0],
      words: DEMO_WORDS,
      duration: 6.5,
      currentTime: 0,
      isPlaying: false,
      selectedWordIndex: null,
      videoFile: null,
      videoUrl: '',
      hasCustomVideo: false
    });
  },

  initFromStorage: async () => {
    if (get().isInitialized) return;

    try {
      // 1. Restore metadata from localStorage
      const rawMeta = localStorage.getItem(STORAGE_KEY_META);
      if (rawMeta) {
        const meta = JSON.parse(rawMeta) as PersistedMetadata;
        set({
          projectName: meta.projectName || 'My Viral Reel',
          aspectRatio: meta.aspectRatio || '9:16',
          duration: meta.duration || 6.5,
          config: meta.config || VIRAL_PRESETS[0],
          words: meta.words && meta.words.length > 0 ? meta.words : DEMO_WORDS,
          hasCustomVideo: !!meta.hasCustomVideo
        });
      }

      // 2. Restore video blob from IndexedDB if present
      const savedBlob = await getFromIdb(IDB_KEY_VIDEO);
      if (savedBlob && savedBlob instanceof Blob) {
        const url = URL.createObjectURL(savedBlob);
        set({
          videoFile: savedBlob,
          videoUrl: url,
          hasCustomVideo: true
        });
      }
    } catch (err) {
      console.warn('Error restoring state from storage:', err);
    } finally {
      set({ isInitialized: true });
    }
  }
}));
