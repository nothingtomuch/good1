import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Timer, ArrowRight, CheckCircle2, XCircle, Languages, Mic, MicOff } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { SYNONYM_ANTONYM_WORDS } from '../data';
import { cn, shuffleArray } from '../lib/utils';
import CircularTimer from './CircularTimer';

interface Props {
  onExit: () => void;
  onFinish: (score: number) => void;
}

export default function SynonymAntonymArena({ onExit, onFinish }: Props) {
  const [shuffledWords] = useState(() => shuffleArray(SYNONYM_ANTONYM_WORDS));
  const [index, setIndex] = useState(0);
  const [synonymInput, setSynonymInput] = useState('');
  const [antonymInput, setAntonymInput] = useState('');
  const [gameState, setGameState] = useState<'ACTIVE' | 'RESULT' | 'GAMEOVER'>('ACTIVE');
  const [score, setScore] = useState(0);
  const [correctFlags, setCorrectFlags] = useState({ synonym: false, antonym: false });

  const { isListening, transcript, startListening, hasSupport } = useSpeechRecognition();

  const current = shuffledWords[index];

  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(15, () => {
    handleSubmit();
  });

  useEffect(() => {
    if (gameState === 'ACTIVE') {
      startTimer(15);
    }
  }, [gameState, startTimer]);

  const handleSubmit = useCallback(() => {
    const inputSyn = synonymInput.trim().toUpperCase();
    const inputAnt = antonymInput.trim().toUpperCase();
    
    const isSynCorrect = current.synonym.some(s => s.toUpperCase() === inputSyn);
    const isAntCorrect = current.antonym.some(a => a.toUpperCase() === inputAnt);
    
    setCorrectFlags({ synonym: isSynCorrect, antonym: isAntCorrect });
    
    let roundScore = 0;
    if (isSynCorrect) roundScore += 10;
    if (isAntCorrect) roundScore += 10;
    
    setScore(s => s + roundScore);
    setGameState('RESULT');
    resetTimer(15);
  }, [synonymInput, antonymInput, current, resetTimer]);

  // Handle Voice Input
  useEffect(() => {
    if (transcript && gameState === 'ACTIVE') {
      // Split transcript by " AND " or similar separators if they are provided, 
      // but the user says "B I G and S M A L L".
      // We'll look for " AND "
      const upperTranscript = transcript.toUpperCase();
      const parts = upperTranscript.split(/\sAND\s/);
      
      if (parts.length >= 2) {
        const synPart = parts[0].replace(/\s/g, '');
        const antPart = parts[1].replace(/\s/g, '');
        setSynonymInput(synPart);
        setAntonymInput(antPart);
        
        // Auto-submit if both parts are set
        if (synPart && antPart) {
           setTimeout(() => handleSubmit(), 500);
        }
      } else {
        // Just fill one if "and" is missing? No, user said they would say both.
        // We'll update the inputs to help them see what's being captured.
        const cleaned = upperTranscript.replace(/\s/g, '');
        // We'll try to be smart - if it starts with the hint letter, it's synonym
        if (cleaned.startsWith(current.synonymHint)) {
          setSynonymInput(cleaned);
        } else {
          setAntonymInput(cleaned);
        }
      }
    }
  }, [transcript, gameState, current.synonymHint, handleSubmit]);

  const handleNext = useCallback(() => {
    if (index + 1 < shuffledWords.length) {
      setIndex(i => i + 1);
      setSynonymInput('');
      setAntonymInput('');
      setGameState('ACTIVE');
    } else {
      setGameState('GAMEOVER');
    }
  }, [index, shuffledWords.length]);

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#F7FAFC] text-[#1A365D]">
        <Languages size={80} className="mb-6 text-[#D69E2E]" />
        <h2 className="text-6xl font-black tracking-tighter uppercase mb-2">Lexicon Complete</h2>
        <p className="font-mono text-sm opacity-50 uppercase tracking-widest mb-8">Vocabulary Synthesis Finalized</p>
        <div className="bg-white border-2 border-[#1A365D] p-10 shadow-2xl mb-12">
            <span className="block text-[10px] uppercase opacity-60 mb-2 tracking-widest font-bold font-mono">Arena Efficiency Score</span>
            <span className="text-7xl font-bold font-mono text-[#D69E2E]">{score}</span>
            <span className="text-2xl font-bold font-mono opacity-30 ml-2">PTS</span>
        </div>
        <button 
          onClick={() => onFinish(score)}
          className="gb-btn gb-btn-fill px-16"
        >
          Exit Arena
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
       {/* UI Header */}
       <div className="header-status mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1A365D]">Word {index + 1} of {shuffledWords.length}</h2>
          <p className="text-[#718096] text-sm font-medium uppercase tracking-tight">Synonym & Antonym Calibration</p>
        </div>
        
        <div className="flex items-center gap-8">
          {hasSupport && (
            <button 
              onClick={startListening}
              disabled={isListening || gameState === 'RESULT'}
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
            <span className="font-mono text-xl font-bold text-[#1A365D]">
                {score.toString().padStart(3, '0')} PTS
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-12">
           <div className="text-center space-y-4">
              <span className="text-[11px] font-mono tracking-[0.4em] uppercase text-[#718096] font-bold">Target Lexeme (Set {index + 1})</span>
              <div className="p-12 border-4 border-[#1A365D]">
                <h3 className="text-7xl font-black tracking-tighter uppercase text-[#1A365D]">
                  {current.word} <span className="text-[#D69E2E] font-mono opacity-60">({current.synonymHint})</span>
                </h3>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Synonym Block */}
             <div className={cn(
               "p-8 border-2 relative transition-all gb-card",
               gameState === 'RESULT' ? (correctFlags.synonym ? "bg-green-50 border-[#38A169]" : "bg-red-50 border-red-600") : "border-[#E2E8F0]"
             )}>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A365D] font-bold block mb-4">Synonym Request</label>
                <div className="relative">
                  <input
                    disabled={gameState === 'RESULT'}
                    value={synonymInput}
                    onChange={e => setSynonymInput(e.target.value)}
                    placeholder={`Starting with ${current.synonymHint}...`}
                    className="w-full bg-transparent text-xl md:text-3xl font-bold uppercase tracking-tight outline-none border-b-2 border-[#1A365D]/10 focus:border-[#1A365D] py-2 text-[#1A365D]"
                  />
                  {gameState === 'RESULT' && (
                    <div className="mt-4 flex items-center justify-between">
                       <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Target: {current.synonym[0]}</p>
                       {correctFlags.synonym ? <CheckCircle2 size={20} className="text-[#38A169]" /> : <XCircle size={20} className="text-red-600" />}
                    </div>
                  )}
                </div>
             </div>

             {/* Antonym Block */}
             <div className={cn(
               "p-8 border-2 relative transition-all gb-card",
               gameState === 'RESULT' ? (correctFlags.antonym ? "bg-green-50 border-[#38A169]" : "bg-red-50 border-red-600") : "border-[#E2E8F0]"
             )}>
                <label className="text-[10px] font-mono uppercase tracking-widest text-[#1A365D] font-bold block mb-4">Antonym Request</label>
                <div className="relative">
                  <input
                    disabled={gameState === 'RESULT'}
                    value={antonymInput}
                    onChange={e => setAntonymInput(e.target.value)}
                    placeholder="Enter Antonym..."
                    className="w-full bg-transparent text-xl md:text-3xl font-bold uppercase tracking-tight outline-none border-b-2 border-[#1A365D]/10 focus:border-[#1A365D] py-2 text-[#1A365D]"
                  />
                  {gameState === 'RESULT' && (
                    <div className="mt-4 flex items-center justify-between">
                       <p className="text-xs font-bold uppercase tracking-wider text-[#718096]">Target: {current.antonym[0]}</p>
                       {correctFlags.antonym ? <CheckCircle2 size={20} className="text-[#38A169]" /> : <XCircle size={20} className="text-red-600" />}
                    </div>
                  )}
                </div>
             </div>
           </div>

           <div className="flex justify-center pt-8 overflow-hidden">
              <AnimatePresence mode="wait">
                {gameState === 'ACTIVE' ? (
                  <motion.button
                    key="submit"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    onClick={handleSubmit}
                    className="gb-btn gb-btn-fill px-16 group flex items-center gap-3"
                  >
                    Submit Response <ArrowRight size={18} className="translate-x-1" />
                  </motion.button>
                ) : (
                  <motion.button
                    key="next"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={handleNext}
                    className="gb-btn gb-btn-accent px-16 flex items-center gap-3"
                  >
                    Next Sequence <ArrowRight size={18} />
                  </motion.button>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="mt-auto border-t border-[#E2E8F0] pt-6 flex justify-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#718096] font-bold inline-flex items-center gap-4">
          <span>05 PTS: SPELLING</span>
          <span className="opacity-20">|</span>
          <span>05 PTS: VOCABULARY</span>
          <span className="opacity-20">|</span>
          <span>TOTAL 20 PER MODULE</span>
        </p>
      </div>
    </div>
  );
}
