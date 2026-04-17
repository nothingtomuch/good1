import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowRight, BookOpen, Mic, MicOff, CheckCircle2, XCircle } from 'lucide-react';
import { POS_EXERCISES } from '../data';
import { cn, shuffleArray } from '../lib/utils';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTimer } from '../hooks/useTimer';
import CircularTimer from './CircularTimer';

interface Props {
  onExit: () => void;
  onFinish: (score: number) => void;
}

export default function PosArena({ onExit, onFinish }: Props) {
  const [shuffledPos] = useState(() => shuffleArray(POS_EXERCISES));
  const [index, setIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'ACTIVE' | 'RESULT' | 'GAMEOVER'>('ACTIVE');
  const [score, setScore] = useState(0);

  const { isListening, transcript, startListening, hasSupport } = useSpeechRecognition();
  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(15, () => {
    if (gameState === 'ACTIVE') {
      handleSelect(-1); // Time out
    }
  });

  const current = shuffledPos[index];

  useEffect(() => {
    if (gameState === 'ACTIVE') {
      startTimer(15);
    }
  }, [gameState, startTimer]);

  const handleSelect = useCallback((idx: number) => {
    if (gameState !== 'ACTIVE') return;
    setSelectedIdx(idx);
    const isCorrect = idx === current.answerIndex;
    if (isCorrect) setScore(s => s + 10);
    setGameState('RESULT');
  }, [gameState, current.answerIndex]);

  const handleNext = useCallback(() => {
    resetTimer(15);
    if (index + 1 < shuffledPos.length) {
      setIndex(i => i + 1);
      setSelectedIdx(null);
      setGameState('ACTIVE');
    } else {
      setGameState('GAMEOVER');
    }
  }, [index, shuffledPos.length, resetTimer]);

  // Handle Voice Input
  useEffect(() => {
    if (transcript && gameState === 'ACTIVE') {
      const speechText = transcript.toUpperCase();
      let foundIdx = -1;
      if (speechText.includes('OPTION A') || speechText === 'A') foundIdx = 0;
      else if (speechText.includes('OPTION B') || speechText === 'B') foundIdx = 1;
      else if (speechText.includes('OPTION C') || speechText === 'C') foundIdx = 2;
      else if (speechText.includes('OPTION D') || speechText === 'D') foundIdx = 3;

      if (foundIdx !== -1 && foundIdx < current.options.length) {
        handleSelect(foundIdx);
      }
    }
  }, [transcript, gameState, current.options.length, handleSelect]);

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#F7FAFC] text-[#1A365D]">
        <Trophy size={100} className="mb-8 text-[#D69E2E] opacity-50" />
        <h2 className="text-5xl font-black mb-2 uppercase tracking-tighter">Grammar Master</h2>
        <p className="font-mono text-xs uppercase tracking-widest mb-12 opacity-50 font-bold">POS Analysis Complete</p>
        
        <div className="bg-white border-2 border-[#1A365D] p-12 shadow-2xl mb-12 flex items-center gap-12">
            <div className="text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest block opacity-40 mb-2">Final Score</span>
                <span className="text-5xl font-bold font-mono text-[#D69E2E]">{score}</span>
                <span className="text-xl opacity-30 ml-2">PTS</span>
            </div>
        </div>

        <button 
          onClick={() => onFinish(score)}
          className="gb-btn gb-btn-fill px-16"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="header-status mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1A365D]">Parts of Speech</h2>
          <p className="text-[#718096] text-sm font-medium uppercase tracking-tight font-mono tracking-widest">Exercise {index + 1} of {shuffledPos.length}</p>
        </div>
        
        <div className="flex items-center gap-6">
            {hasSupport && (
              <button 
                onClick={startListening}
                disabled={isListening || gameState !== 'ACTIVE'}
                className={cn(
                  "p-3 rounded-full border-2 transition-all shadow-sm",
                  isListening ? "bg-red-500 border-red-600 text-white animate-pulse" : "bg-white border-[#1A365D] text-[#1A365D] hover:bg-gray-50"
                )}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}

            {gameState === 'ACTIVE' && (
              <CircularTimer timeLeft={timeLeft} initialTime={15} size={50} />
            )}

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase opacity-40 font-mono tracking-widest">Arena Score</span>
              <span className="font-mono text-xl font-bold text-[#1A365D] tabular-nums">
                  {score.toString().padStart(3, '0')} PTS
              </span>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-8 md:space-y-12 py-6">
         <div className="text-center w-full max-w-2xl px-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#718096] font-black mb-6 md:mb-8 font-mono border-b-2 border-dashed border-[#E2E8F0] pb-2 inline-block leading-tight">
                Identify Part of Speech for the Target Word
            </p>
            <div className="text-2xl md:text-3xl lg:text-4xl font-sans font-medium text-[#1A365D] leading-relaxed mb-6">
               {current.sentence.split(' ').map((word, i) => {
                  const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                  const isTarget = cleanWord.toLowerCase() === current.targetWord.toLowerCase();
                  return (
                    <span key={i} className={cn(
                        "inline-block mr-1 md:mr-2 px-1 rounded-sm transition-all",
                        isTarget && "bg-[#D69E2E] text-white font-black shadow-md -rotate-1 scale-110 mx-1"
                    )}>
                        {word}
                    </span>
                  )
               })}
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl px-4 md:px-8">
            {current.options.map((opt, idx) => {
                const isCorrect = idx === current.answerIndex;
                const isSelected = idx === selectedIdx;
                const labels = ['A', 'B', 'C', 'D'];

                return (
                    <button
                        key={idx}
                        disabled={gameState !== 'ACTIVE'}
                        onClick={() => handleSelect(idx)}
                        className={cn(
                            "group p-6 border-2 transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden gb-card min-h-[100px] md:min-h-[140px]",
                            gameState === 'ACTIVE' 
                              ? "border-[#E2E8F0] hover:border-[#1A365D] hover:shadow-lg" 
                              : isCorrect 
                                ? "border-[#38A169] bg-green-50 text-[#1A365D] z-10" 
                                : isSelected 
                                  ? "border-red-600 bg-red-50 text-red-600 z-10" 
                                  : "opacity-40 grayscale pointer-events-none"
                        )}
                    >
                        <span className="text-[9px] md:text-xs font-mono font-bold opacity-40 uppercase tracking-widest absolute top-2 left-2">
                           Option {labels[idx]}
                        </span>
                        <span className="text-lg md:text-xl font-bold uppercase tracking-tight">{opt}</span>
                        {gameState !== 'ACTIVE' && isCorrect && <CheckCircle2 size={16} className="text-[#38A169] md:w-5 md:h-5" />}
                        {gameState !== 'ACTIVE' && isSelected && !isCorrect && <XCircle size={16} className="text-red-600 md:w-5 md:h-5" />}
                    </button>
                );
            })}
         </div>

         <AnimatePresence>
            {gameState === 'RESULT' && (
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6"
                >
                    <p className={cn(
                        "font-mono text-xs uppercase font-black tracking-[0.4em]",
                        selectedIdx === current.answerIndex ? "text-[#38A169]" : "text-red-600"
                    )}>
                        {selectedIdx === current.answerIndex ? "[ Analysis Verified ]" : "[ Analysis Mismatch ]"}
                    </p>
                    <button 
                        onClick={handleNext}
                        className="gb-btn gb-btn-fill px-16 flex items-center gap-4 group"
                    >
                        Continue <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </motion.div>
            )}
         </AnimatePresence>

         {isListening && (
           <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#1A365D] text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest">Listening for "Option A/B/C/D"...</span>
           </div>
         )}
      </main>
    </div>
  );
}
