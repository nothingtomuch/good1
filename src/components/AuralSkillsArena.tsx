import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Volume2, 
  Play, 
  Pause, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  History,
  FileText,
  Clock,
  Mic,
  MicOff
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTimer } from '../hooks/useTimer';
import { AURAL_SKILLS } from '../data';
import { cn, shuffleArray } from '../lib/utils';
import CircularTimer from './CircularTimer';

interface Props {
  onExit: () => void;
  onFinish: (score: number) => void;
}

export default function AuralSkillsArena({ onExit, onFinish }: Props) {
  const [shuffledAural] = useState(() => shuffleArray(AURAL_SKILLS));
  const [index, setIndex] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'AWAIT_AUDIO' | 'PLAYING_AUDIO' | 'QUESTIONS' | 'GAMEOVER'>('AWAIT_AUDIO');
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const { speak, stop } = useSpeech();
  const { isListening, transcript, startListening, hasSupport } = useSpeechRecognition();
  const { timeLeft, start: startTimer, reset: resetTimer } = useTimer(30, () => {
    if (gameState === 'QUESTIONS' && !showFeedback) {
      handleSelectOption(-1); // Time out
    }
  });

  const current = shuffledAural[index];
  const currentQuestion = current.questions[questionIdx];

  const handleStartAudio = useCallback(() => {
    setGameState('PLAYING_AUDIO');
    speak(current.transcript, () => {
      setGameState('QUESTIONS');
      startTimer(30);
    });
  }, [current, speak, startTimer]);

  const handleSelectOption = useCallback((idx: number) => {
    if (showFeedback) return;
    setSelectedIdx(idx);
    setShowFeedback(true);
    if (idx === currentQuestion.answerIndex) {
      setScore(s => s + 5);
    }
  }, [showFeedback, currentQuestion.answerIndex]);

  // Handle Voice Input
  useEffect(() => {
    if (transcript && gameState === 'QUESTIONS' && !showFeedback) {
      const speechText = transcript.toUpperCase();
      let foundIdx = -1;
      if (speechText.includes('OPTION A') || speechText === 'A') foundIdx = 0;
      else if (speechText.includes('OPTION B') || speechText === 'B') foundIdx = 1;
      else if (speechText.includes('OPTION C') || speechText === 'C') foundIdx = 2;
      else if (speechText.includes('OPTION D') || speechText === 'D') foundIdx = 3;

      if (foundIdx !== -1 && foundIdx < currentQuestion.options.length) {
        handleSelectOption(foundIdx);
      }
    }
  }, [transcript, gameState, showFeedback, currentQuestion.options.length, handleSelectOption]);

  const handleNext = () => {
    setSelectedIdx(null);
    setShowFeedback(false);
    resetTimer(30);
    
    if (questionIdx + 1 < current.questions.length) {
      setQuestionIdx(q => q + 1);
      startTimer(30);
    } else {
      if (index + 1 < shuffledAural.length) {
          setGameState('AWAIT_AUDIO');
          setIndex(i => i + 1);
          setQuestionIdx(0);
      } else {
          setGameState('GAMEOVER');
      }
    }
  };

  useEffect(() => {
    return () => stop();
  }, [stop]);

  if (gameState === 'GAMEOVER') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#F7FAFC] text-[#1A365D]">
        <div className="relative mb-12">
            <History size={100} className="text-[#D69E2E] relative z-10" />
        </div>
        <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 text-center">Historical Archives Synced</h2>
        <p className="font-mono text-sm opacity-50 uppercase tracking-[0.4em] mb-12">Comprehension Metrics Verified</p>
        
        <div className="bg-white border-2 border-[#1A365D] p-12 shadow-2xl mb-12">
            <span className="text-[10px] uppercase font-bold font-mono opacity-40 mb-3 block text-center tracking-widest text-[#718096]">Aural Efficiency Score</span>
            <span className="text-7xl font-bold font-mono tracking-tighter text-[#D69E2E]">{score}</span>
            <span className="text-2xl font-bold font-mono opacity-20 ml-2">PTS</span>
        </div>

        <button 
          onClick={() => onFinish(score)}
          className="gb-btn gb-btn-fill px-16"
        >
          Finalize Session
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white text-[#2D3748] relative">
      <header className="header-status mb-8">
        <div>
            <h2 className="text-2xl font-bold text-[#1A365D]">Oral-Aural Module</h2>
            <p className="text-[#718096] text-sm font-medium uppercase tracking-tight">{current.title}</p>
        </div>
        <div className="flex items-center gap-6">
            {hasSupport && (
              <button 
                onClick={startListening}
                disabled={isListening || gameState !== 'QUESTIONS' || showFeedback}
                className={cn(
                  "p-3 rounded-full border-2 transition-all shadow-sm",
                  isListening ? "bg-red-500 border-red-600 text-white animate-pulse" : "bg-white border-[#1A365D] text-[#1A365D] hover:bg-gray-50"
                )}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}
            
            {gameState === 'QUESTIONS' && (
              <CircularTimer timeLeft={timeLeft} initialTime={30} size={50} />
            )}

            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase opacity-40 font-mono tracking-widest">Arena Score</span>
              <span className="font-mono text-xl font-bold text-[#1A365D] tabular-nums underline decoration-[#D69E2E] decoration-2 underline-offset-4">
                  {score.toString().padStart(3, '0')}
              </span>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="wait">
           {gameState === 'AWAIT_AUDIO' && (
             <motion.div 
               key="await"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="flex-1 flex flex-col items-center justify-center p-12 text-center"
             >
                <div className="w-40 h-40 rounded-full border-4 border-[#1A365D] flex items-center justify-center mb-10 bg-[#F7FAFC] shadow-inner">
                   <Volume2 size={64} className="text-[#1A365D]" />
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 max-w-md text-[#1A365D]">Audio Transcript Ready</h3>
                <p className="text-[#718096] text-sm max-w-sm mb-12 leading-relaxed font-medium">Listen carefully to the passage. Questions will follow focusing on minute historical details and vocabulary usage.</p>
                <button 
                    onClick={handleStartAudio}
                    className="gb-btn gb-btn-fill px-16 flex items-center gap-4"
                >
                    <Play size={16} fill="white" /> Begin Aural Stream
                </button>
             </motion.div>
           )}

           {gameState === 'PLAYING_AUDIO' && (
             <motion.div 
               key="playing"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex-1 flex flex-col items-center justify-center p-12 text-center"
             >
                <div className="flex gap-2 mb-12 h-24 items-center">
                    {[...Array(8)].map((_, i) => (
                        <motion.div 
                            key={i}
                            animate={{ height: [ 20, Math.random() * 80 + 20, 20 ] }}
                            transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                            className="w-3 bg-[#1A365D] rounded-full"
                        />
                    ))}
                </div>
                <h3 className="text-xl font-mono uppercase tracking-[0.4em] text-[#D69E2E] mb-2 font-bold animate-pulse">Stream Active</h3>
                <p className="text-[#4A5568] text-sm font-bold uppercase tracking-widest">Listening: {current.title}</p>
                <button 
                  onClick={() => { stop(); setGameState('QUESTIONS'); }}
                  className="mt-12 text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A365D] font-black hover:bg-[#1A365D] hover:text-white px-6 py-2 border-2 border-[#1A365D] transition-all"
                >
                  Skip Stream &rarr; Questions
                </button>
             </motion.div>
           )}

           {gameState === 'QUESTIONS' && (
             <motion.div 
               key="questions"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex-1 flex flex-col py-6 w-full"
             >
                <div className="flex items-center gap-6 mb-12">
                    <span className="font-mono text-[11px] uppercase font-black text-[#1A365D] tracking-[0.3em] whitespace-nowrap">Comprehension Question {questionIdx + 1} of {current.questions.length}</span>
                    <div className="h-1 flex-1 bg-[#E2E8F0] relative overflow-hidden">
                       <motion.div 
                          className="absolute inset-y-0 left-0 bg-[#38A169]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${((questionIdx + 1) / current.questions.length) * 100}%` }}
                       />
                    </div>
                </div>

                <div className="mb-12">
                   <h2 className="text-4xl font-extrabold tracking-tight leading-tight text-[#1A365D] border-l-8 border-[#D69E2E] pl-8">
                        {currentQuestion.question}
                   </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {currentQuestion.options.map((opt, idx) => {
                       const isCorrect = idx === currentQuestion.answerIndex;
                       const isSelected = idx === selectedIdx;

                       return (
                           <button
                             key={idx}
                             disabled={showFeedback}
                             onClick={() => handleSelectOption(idx)}
                             className={cn(
                               "text-left p-6 border-2 transition-all flex items-center justify-between group gb-card",
                               !showFeedback 
                                 ? "border-[#E2E8F0] hover:border-[#1A365D] hover:shadow-lg" 
                                 : isCorrect 
                                     ? "border-[#38A169] bg-green-50 text-[#1A365D]" 
                                     : isSelected 
                                         ? "border-red-600 bg-red-50 text-red-600" 
                                         : "opacity-40 grayscale pointer-events-none"
                             )}
                           >
                               <span className="text-lg font-bold uppercase tracking-tight">{opt}</span>
                               <div className={cn(
                                   "w-10 h-10 border-2 flex items-center justify-center transition-all font-mono font-bold",
                                   !showFeedback 
                                      ? "border-[#1A365D] text-[#1A365D] group-hover:bg-[#1A365D] group-hover:text-white" 
                                      : isCorrect ? "bg-[#38A169] border-[#38A169] text-white" : "bg-red-600 border-red-600 text-white"
                               )}>
                                   {showFeedback ? (isCorrect ? <CheckCircle2 size={20} /> : isSelected ? <XCircle size={20} /> : null) : String.fromCharCode(65 + idx)}
                               </div>
                           </button>
                       )
                   })}
                </div>

                <div className="h-32 flex items-center justify-center overflow-hidden">
                    <AnimatePresence>
                        {showFeedback && (
                            <motion.button
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                onClick={handleNext}
                                className="gb-btn gb-btn-accent px-16 flex items-center gap-3"
                            >
                                Continue Training <ArrowRight size={16} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
             </motion.div>
           )}
        </AnimatePresence>

        {isListening && (
            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-[#1A365D] text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl z-50">
               <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
               <span className="font-mono text-xs uppercase tracking-widest">Listening for "Option A/B/C/D"...</span>
            </div>
          )}
      </main>

      <footer className="mt-auto pt-6 border-t border-[#E2E8F0] flex items-center justify-between opacity-50">
          <div className="flex gap-2">
             <Clock size={14} className="text-[#1A365D]" />
             <span className="font-mono text-[9px] uppercase tracking-widest font-black text-[#1A365D]">Aural Integrity Check: Active</span>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest font-black text-[#1A365D]">
              Stream Progress: {((index * 5 + questionIdx + 1) / (shuffledAural.length * 5) * 100).toFixed(0)}%
          </div>
      </footer>
    </div>
  );
}
