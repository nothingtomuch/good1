import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  RotateCcw, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  XCircle,
  Timer,
  Info,
  Trophy,
  Mic,
  MicOff
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTimer } from '../hooks/useTimer';
import { SPELL_IT_WORDS, WordEntry } from '../data';
import { cn, shuffleArray } from '../lib/utils';
import CircularTimer from './CircularTimer';

interface Props {
  onExit: () => void;
  onFinish: (score: number) => void;
}

export default function SpellItArena({ onExit, onFinish }: Props) {
  const [shuffledWords] = useState(() => shuffleArray(SPELL_IT_WORDS));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [playsCount, setPlaysCount] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'RESULT' | 'GAMEOVER'>('IDLE');
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  
  const { speak } = useSpeech();
  const { isListening, transcript, startListening, hasSupport } = useSpeechRecognition();
  const currentWord = shuffledWords[index];

  const handleLevelUp = useCallback(() => {
    if (feedback?.isCorrect) {
      setScore(s => s + 5);
      setCorrectCount(c => c + 1);
    }
    
    if (index + 1 < shuffledWords.length) {
      setIndex(i => i + 1);
      setGameState('IDLE');
      setInput('');
      setPlaysCount(0);
      setFeedback(null);
    } else {
      setGameState('GAMEOVER');
    }
  }, [index, feedback, shuffledWords.length]);

  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(10, () => {
    // Time's up
    handleSubmit();
  });

  const handlePlayAudio = useCallback(() => {
    if (playsCount < 3) {
      // Use lowercase to ensure word pronunciation instead of spelling
      speak(currentWord.word.toLowerCase());
      setPlaysCount(p => p + 1);
      if (gameState === 'IDLE') {
        setGameState('PLAYING');
        startTimer(10);
      }
    }
  }, [currentWord, playsCount, gameState, speak, startTimer]);

  const handleSubmit = useCallback(() => {
    const isCorrect = input.trim().toUpperCase() === currentWord.word.toUpperCase();
    setFeedback({
      isCorrect,
      message: isCorrect ? 'EXCELLENT' : `INCORRECT: ${currentWord.word.toUpperCase()}`
    });
    setGameState('RESULT');
    resetTimer(10);
  }, [input, currentWord, resetTimer]);

  // Handle Voice Input
  useEffect(() => {
    if (transcript && gameState === 'PLAYING') {
      // User says "a p i a r y" or "apiary"
      // Most recognizers join letters or return the word.
      // We clean it up: remove spaces and compare.
      const processed = transcript.replace(/\s/g, '').toUpperCase();
      setInput(processed);
      
      // Auto-submit if the processed transcript matches the word
      if (processed === currentWord.word.toUpperCase()) {
         setTimeout(() => handleSubmit(), 500);
      }
    }
  }, [transcript, gameState, currentWord.word, handleSubmit]);

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#F7FAFC]">
        <TrophyIcon className="w-24 h-24 mb-6 text-[#D69E2E]" />
        <h2 className="text-5xl font-black tracking-tighter uppercase mb-2 text-[#1A365D]">Competition Complete</h2>
        <p className="font-mono text-sm opacity-50 uppercase tracking-widest mb-8">Data Synthesis Complete</p>
        
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <span className="block text-[10px] uppercase opacity-40 mb-1">Words Mastered</span>
            <span className="text-4xl font-bold font-mono text-[#1A365D]">{correctCount}/{shuffledWords.length}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase opacity-40 mb-1">Total Points</span>
            <span className="text-4xl font-bold font-mono text-[#D69E2E]">{score} PTS</span>
          </div>
        </div>

        <button 
          onClick={() => onFinish(score)}
          className="gb-btn gb-btn-fill px-12"
        >
          Exit Arena
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col relative">
      {/* Top Bar */}
      <div className="header-status mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1A365D]">Word {index + 1} of {shuffledWords.length}</h2>
          <p className="text-[#718096] text-sm font-medium">Session Accuracy: {((correctCount / (index || 1)) * 100).toFixed(0)}%</p>
        </div>
        
        <div className="flex items-center gap-8">
            {hasSupport && (
              <button 
                onClick={startListening}
                disabled={isListening || gameState !== 'PLAYING'}
                className={cn(
                  "p-3 rounded-full border-2 transition-all shadow-sm",
                  isListening ? "bg-red-500 border-red-600 text-white animate-pulse" : "bg-white border-[#1A365D] text-[#1A365D] hover:bg-gray-50"
                )}
                title="Speak Spelling"
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}

            <CircularTimer timeLeft={timeLeft} initialTime={10} size={50} />

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase opacity-40 font-mono tracking-widest">Arena Score</span>
              <span className="font-mono text-xl font-bold text-[#1A365D]">{score.toString().padStart(3, '0')} PTS</span>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-xl flex flex-col items-center space-y-12">
          {/* Audio Trigger Cluster */}
          <div className="relative group">
            {gameState === 'PLAYING' && (
               <div className="absolute inset-0 -m-6 md:-m-8 border-2 border-dashed border-[#1A365D]/20 rounded-full animate-[spin_10s_linear_infinite]" />
            )}
            
            <button
              disabled={playsCount >= 3 || gameState === 'RESULT'}
              onClick={handlePlayAudio}
              className={cn(
                "w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#1A365D] flex flex-col items-center justify-center gap-2 transition-all relative z-10",
                playsCount < 3 && gameState !== 'RESULT' 
                  ? "bg-white hover:bg-[#F7FAFC] shadow-xl cursor-pointer" 
                  : "bg-gray-100 opacity-50 cursor-not-allowed border-[#E2E8F0] text-[#718096]"
              )}
            >
              <Volume2 size={32} className={cn("md:w-10 md:h-10", gameState === 'PLAYING' ? "animate-pulse text-[#1A365D]" : "text-[#1A365D]")} />
              <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-[0.2em] font-bold px-4 text-center">
                {playsCount === 0 ? "Play Word" : `Replay (${3 - playsCount})`}
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
             {gameState === 'PLAYING' && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="flex flex-col items-center gap-6 w-full"
               >
                 <div className="w-full max-w-[500px] p-6 md:p-10 border-4 border-[#1A365D] relative">
                    <input
                      autoFocus
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                      placeholder="TYPE"
                      className="w-full text-center text-2xl md:text-4xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em] outline-none placeholder:text-[#1A365D]/5 bg-transparent text-[#1A365D]"
                    />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 bg-white text-[#718096] text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                       Verify and Press Enter
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2 text-[#718096] italic">
                   <Info size={14} />
                   <p className="text-[11px] font-medium uppercase tracking-tighter">British English Lexicon Rules Apply</p>
                 </div>
               </motion.div>
             )}

             {gameState === 'RESULT' && feedback && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className={cn(
                   "p-8 border-2 w-full max-w-md flex flex-col items-center text-center gap-4",
                   feedback.isCorrect ? "border-[#38A169] bg-green-50" : "border-red-600 bg-red-50"
                 )}
               >
                 {feedback.isCorrect ? <CheckCircle2 className="text-[#38A169] w-12 h-12" /> : <XCircle className="text-red-600 w-12 h-12" />}
                 <div>
                    <h3 className={cn("text-5xl font-black tracking-tighter uppercase", feedback.isCorrect ? "text-[#38A169]" : "text-red-600")}>
                      {feedback.isCorrect ? "Correct" : "Incorrect"}
                    </h3>
                    <p className="font-mono text-lg mt-2 font-bold uppercase tracking-widest text-[#1A365D]">{currentWord.word.toUpperCase()}</p>
                 </div>
                 
                 <div className="w-full h-[1px] bg-[#1A365D]/10 my-4" />
                 
                 <div className="grid grid-cols-1 gap-4 w-full">
                    <div className="gb-card">
                      <span className="info-title">Phonetic Script</span>
                      <p className="info-content font-mono font-bold text-[#1A365D] tracking-widest">{currentWord.script}</p>
                    </div>
                    <div className="gb-card">
                      <span className="info-title">Etymology & Meaning</span>
                      <p className="info-content text-[#2D3748] italic">{currentWord.meaning}</p>
                    </div>
                 </div>

                 <button 
                  onClick={handleLevelUp}
                  className="gb-btn gb-btn-fill w-full mt-4 flex items-center justify-center gap-3"
                 >
                   Continue Training <ArrowRight size={16} />
                 </button>
               </motion.div>
             )}

             {gameState === 'IDLE' && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="flex flex-col items-center gap-2"
               >
                  <p className="text-[#D69E2E] font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Awaiting Audio Input</p>
                  <p className="text-sm text-center max-w-xs opacity-40 italic font-medium">Listening device ready. Attempt 1 of 3.</p>
               </motion.div>
             )}
          </AnimatePresence>

          {isListening && (
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#1A365D] text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl z-50">
               <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
               <span className="font-mono text-xs uppercase tracking-widest">Listening... Speak spelling clearly</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-auto">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] uppercase font-bold text-[#718096] tracking-widest">Arena Progress</span>
            <span className="text-[10px] font-mono font-bold text-[#1A365D] uppercase">{index + 1} / {SPELL_IT_WORDS.length} Modules</span>
          </div>
          <div className="progress-indicator">
            <motion.div 
                className="progress-bar" 
                initial={{ width: 0 }}
                animate={{ width: `${((index + 1) / SPELL_IT_WORDS.length) * 100}%` }}
            />
          </div>
      </div>
    </div>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center rounded-full border-8 border-current", className)}>
      <Trophy size={48} />
    </div>
  );
}
