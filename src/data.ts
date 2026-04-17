export interface WordEntry {
  word: string;
  script: string;
  meaning: string;
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

export const SPELL_IT_WORDS: WordEntry[] = [
  { word: "Apiary", script: "/'eɪ.pi.ə.ri/", meaning: "a place where bees are kept" },
  { word: "Pestilence", script: "/'pes.tɪ.ləns/", meaning: "a serious and growing problem" },
  { word: "External", script: "/ɪk'stɜː.nəl/", meaning: "anything relating or belonging to the outside" },
  { word: "Curable", script: "/'kjʊə.rə.bl̩/", meaning: "capable of being remedied or corrected" },
  { word: "Crockery", script: "/'krɒk.ə.ri/", meaning: "earthenware made from baked clay" },
  { word: "Haulage", script: "/'hɔː.lɪdʒ/", meaning: "the business of moving things by road or railway" },
  { word: "Intuition", script: "/ˌɪn.tjuː'ɪʃ.ən/", meaning: "instinctive knowledge or feeling" },
  { word: "Stagnant", script: "/'stæɡ.nənt/", meaning: "not flowing or moving, and smelling unpleasant" },
  { word: "Confidant", script: "/'kɒn.fɪ.dænt/", meaning: "one to whom secrets are entrusted" },
  { word: "Nasal", script: "/'neɪ.zəl/", meaning: "pertaining to the nose" },
  { word: "Aeolian", script: "/iː'əʊ.li.ən/", meaning: "produced or carried by the wind" },
  { word: "Default", script: "/dɪ'fɔːlt/", meaning: "the neglect or omission of a legal requirement" },
  { word: "Congeal", script: "/kən'dʒiːl/", meaning: "to change from a liquid or soft state to a thick or solid state" },
  { word: "Burlesque", script: "/bɜː'lesk/", meaning: "a type of writing or acting that tries to make something serious seem stupid" },
  { word: "Pervade", script: "/pə'veɪd/", meaning: "to pass or spread through every part" },
];

export const SYNONYM_ANTONYM_WORDS: SynonymAntonymEntry[] = [
  { word: "LARGE", synonymHint: "B", synonym: ["BIG", "HUGE", "ENORMOUS"], antonym: ["SMALL", "TINY", "LITTLE"] },
  { word: "AFFABLE", synonymHint: "F", synonym: ["FRIENDLY", "AMIABLE", "GENIAL"], antonym: ["HOSTILE", "UNFRIENDLY", "SURLY", "COLD"] },
  { word: "CRUDE", synonymHint: "N", synonym: ["NATURAL", "RAW"], antonym: ["UNNATURAL", "REFINED", "PROCESSED"] },
  { word: "BEWITCH", synonymHint: "E", synonym: ["ENCHANT", "CHARM", "CAPTIVATE"], antonym: ["DEPRESS", "REPEL", "BORE"] },
  { word: "VALID", synonymHint: "S", synonym: ["STRONG", "LEGAL", "SOUND"], antonym: ["WEAK", "INVALID", "NULL"] },
  { word: "CONDEMN", synonymHint: "D", synonym: ["DENOUNCE", "CRITICIZE"], antonym: ["APPROVE", "PRAISE", "COMMEND"] },
  { word: "FRAGILE", synonymHint: "V", synonym: ["VULNERABLE", "DELICATE"], antonym: ["SECURE", "STRONG", "ROBUST"] },
  { word: "AGONISE", synonymHint: "W", synonym: ["WORRY", "STRUGGLE"], antonym: ["JOY", "RELAX", "COMFORT"] },
  { word: "CANDID", synonymHint: "S", synonym: ["SINCERE", "HONEST", "FRANK"], antonym: ["DISHONEST", "DECEITFUL", "INSINCERE"] },
  { word: "EXPLICIT", synonymHint: "P", synonym: ["PRECISE", "CLEAR", "DEFINITE"], antonym: ["GENERAL", "VAGUE", "AMBIGUOUS"] },
];

export const SEGMENTALS: SegmentalEntry[] = [
  { word: "MANY", underlinedLetter: "A", options: [{label: "a", sound: "/ə/"}, {label: "b", sound: "/æ/"}, {label: "c", sound: "/e/"}], answerIndex: 2 },
  { word: "CORNER", underlinedLetter: "O", options: [{label: "a", sound: "/ɔɪ/"}, {label: "b", sound: "/ɒ/"}, {label: "c", sound: "/ɔː/"}], answerIndex: 2 },
  { word: "BELOW", underlinedLetter: "OW", options: [{label: "a", sound: "/əʊ/"}, {label: "b", sound: "/ɒ/"}, {label: "c", sound: "/aʊ/"}], answerIndex: 0 },
  { word: "SCATTER", underlinedLetter: "A", options: [{label: "a", sound: "/ɑː/"}, {label: "b", sound: "/æ/"}, {label: "c", sound: "/ʌ/"}], answerIndex: 1 },
  { word: "RESPECT", underlinedLetter: "E", options: [{label: "a", sound: "/e/"}, {label: "b", sound: "/ə/"}, {label: "c", sound: "/ɪ/"}], answerIndex: 2 },
];

export const AURAL_SKILLS: AuralEntry[] = [
  {
    title: "The Chola Dynasty – The Brihadisvara Temple",
    transcript: "The Brihadisvara Temple in Thanjavur, built by Rajaraja I in 1010 CE, is a pinnacle of Dravidian architecture. Its most striking feature is the 'Vimana' or temple tower, which stands 216 feet tall. Remarkably, the 'Kumbam' (the apex structure) is carved from a single granite block weighing 80 tons. Legend suggests a 6-kilometre ramp was built to haul this stone to the top.",
    questions: [
      { question: "Who commissioned the Brihadisvara Temple?", options: ["Rajendra I", "Rajaraja I", "Karikala Chola", "Aditya I"], answerIndex: 1 },
      { question: "What is the height of the Vimana?", options: ["180 feet", "200 feet", "216 feet", "250 feet"], answerIndex: 2 },
      { question: "The 'Kumbam' at the top is made of which material?", options: ["Marble", "Sandstone", "Granite", "Limestone"], answerIndex: 2 },
      { question: "How much does the apex stone weigh?", options: ["10 tons", "40 tons", "60 tons", "80 tons"], answerIndex: 3 },
      { question: "How long was the ramp used to transport the stone?", options: ["2 km", "4 km", "6 km", "10 km"], answerIndex: 2 },
    ]
  },
  {
    title: "The Maratha Empire – Raigad Fort",
    transcript: "Raigad Fort served as the capital of Chhatrapati Shivaji Maharaj’s Maratha Empire. Perched in the Sahyadri mountains, it is accessible via a single path. The fort features the 'Maha Darwaza' (Main Gate) and the 'Hirkani Wadi'. Its design prioritised defence, with steep cliffs on all sides making it virtually impregnable to enemies.",
    questions: [
      { question: "Which ruler made Raigad his capital?", options: ["Sambhaji Maharaj", "Baji Rao I", "Shivaji Maharaj", "Tarabai"], answerIndex: 2 },
      { question: "In which mountain range is Raigad located?", options: ["Himalayas", "Sahyadri", "Aravalli", "Nilgiri"], answerIndex: 1 },
      { question: "How many paths lead up to the fort?", options: ["One", "Two", "Three", "Multiple"], answerIndex: 0 },
      { question: "What is the name of the main gateway?", options: ["Delhi Darwaza", "Maha Darwaza", "Buland Darwaza", "Ganesh Pol"], answerIndex: 1 },
      { question: "What was the primary focus of Raigad's architectural design?", options: ["Trade", "Religious worship", "Defense", "Artistic beauty"], answerIndex: 2 },
    ]
  }
];

export const POS_EXERCISES: PosEntry[] = [
  { sentence: "The ballerina danced gracefully.", targetWord: "gracefully", options: ["Noun", "Verb", "Adjective", "Adverb"], answerIndex: 3 },
  { sentence: "The movie was extremely long.", targetWord: "extremely", options: ["Noun", "Verb", "Adjective", "Adverb"], answerIndex: 3 },
  { sentence: "The answer is nearly correct.", targetWord: "nearly", options: ["Noun", "Verb", "Adjective", "Adverb"], answerIndex: 3 },
  { sentence: "She is reading a book.", targetWord: "She", options: ["Noun", "Pronoun", "Verb", "Adjective"], answerIndex: 1 },
  { sentence: "I want fruit and yogurt.", targetWord: "and", options: ["Preposition", "Conjunction", "Interjection", "Adverb"], answerIndex: 1 },
];
