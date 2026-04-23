import { VOL_VII_A_WORDS } from './data/spellWordsBatch1';
import { VOL_VII_A_WORDS_2 } from './data/spellWordsBatch2';
import { VOL_VII_B_WORDS } from './data/spellWordsBatch3';
import { VOL_VII_B_WORDS_2 } from './data/spellWordsBatch4';
import { TOUGH_WORDS_BATCH_1 } from './data/toughSpellingWords';
import { VOL_VII_B_SYNONYMS as BATCH_VII_B_SYNONYMS } from './data/synonymsBatch1';
import { VOL_III_B_SYNONYMS as BATCH_III_B_SYNONYMS } from './data/synonymsBatch2';
import { AURAL_SKILLS as AURAL_SKILLS_DATA } from './data/synonymsAndAural';
import { SEGMENTALS as SEGMENTALS_DATA, SEGMENTALS_EXTRA } from './data/segmentalsData';
import { POS_BATCH_1, POS_BATCH_2 } from './data/posData';

export interface WordEntry {
  word: string;
  script: string;
  meaning: string;
  origin?: string;
}

export interface SynonymAntonymEntry {
  word: string;
  synonymHint: string;
  synonym: string[];
  antonym: string[];
}

export interface SegmentalEntry {
  word: string;
  underlinedLetter: string;
  options: { label: string; sound: string }[];
  answerIndex: number;
}

export interface AuralEntry {
  title: string;
  transcript: string;
  questions: {
    question: string;
    options: string[];
    answerIndex: number;
  }[];
}

export interface PosEntry {
  sentence: string;
  targetWord: string;
  options: string[];
  answerIndex: number;
}

// Archived spelling lists (saved temporarily)
export const ARCHIVED_SPELL_WORDS: WordEntry[] = [
  ...VOL_VII_A_WORDS,
  ...VOL_VII_A_WORDS_2,
  ...VOL_VII_B_WORDS,
  ...VOL_VII_B_WORDS_2
];

// Current active spelling list (500 tough words)
export const SPELL_IT_WORDS: WordEntry[] = [
  ...TOUGH_WORDS_BATCH_1
];

export const SYNONYM_ANTONYM_WORDS_FULL: SynonymAntonymEntry[] = [
  ...BATCH_VII_B_SYNONYMS,
  ...BATCH_III_B_SYNONYMS
];

export const SEGMENTALS: SegmentalEntry[] = [
  ...SEGMENTALS_DATA,
  ...SEGMENTALS_EXTRA
];

export const AURAL_SKILLS: AuralEntry[] = AURAL_SKILLS_DATA;

export const POS_EXERCISES: PosEntry[] = [
  ...POS_BATCH_1,
  ...POS_BATCH_2
];

// Compatibility exports
export { SYNONYM_ANTONYM_WORDS_FULL as SYNONYM_ANTONYM_WORDS };
