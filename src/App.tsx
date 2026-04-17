import { useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  BookOpen, 
  Volume2, 
  Languages, 
  Mic2, 
  Settings as SettingsIcon,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';
import { cn } from './lib/utils';
import SpellItArena from './components/SpellItArena';
import SynonymAntonymArena from './components/SynonymAntonymArena';
import SegmentalsArena from './components/SegmentalsArena';
import AuralSkillsArena from './components/AuralSkillsArena';
import PosArena from './components/PosArena';

type Round = 'SPELL_IT' | 'SYNONYM_ANTONYM' | 'AURAL_SKILLS' | 'SEGMENTALS' | 'POS' | null;

export default function App() {
  const [activeRound, setActiveRound] = useState<Round>(null);
  const [totalScore, setTotalScore] = useState(0);

  const handleFinishRound = useCallback((score: number) => {
    setTotalScore(prev => prev + score);
    setActiveRound(null);
  }, []);

  const rounds: { id: string; label: string; title: string; icon: ReactNode }[] = [
    { id: 'SPELL_IT', label: 'Round 01', title: 'Spell It', icon: <Volume2 size={16} /> },
    { id: 'SYNONYM_ANTONYM', label: 'Round 02', title: 'Synonyms', icon: <Languages size={16} /> },
    { id: 'AURAL_SKILLS', label: 'Round 03', title: 'Aural Skills', icon: <Mic2 size={16} /> },
    { id: 'SEGMENTALS', label: 'Round 04', title: 'Segmentals', icon: <BookOpen size={16} /> },
    { id: 'POS', label: 'Round 05', title: 'Part of Speech', icon: <GraduationCap size={16} /> },
  ];

  const renderArena = () => {
    switch (activeRound) {
      case 'SPELL_IT':
        return <SpellItArena onExit={() => setActiveRound(null)} onFinish={handleFinishRound} />;
      case 'SYNONYM_ANTONYM':
        return <SynonymAntonymArena onExit={() => setActiveRound(null)} onFinish={handleFinishRound} />;
      case 'SEGMENTALS':
        return <SegmentalsArena onExit={() => setActiveRound(null)} onFinish={handleFinishRound} />;
      case 'AURAL_SKILLS':
        return <AuralSkillsArena onExit={() => setActiveRound(null)} onFinish={handleFinishRound} />;
      case 'POS':
        return <PosArena onExit={() => setActiveRound(null)} onFinish={handleFinishRound} />;
      default:
        return (
          <div className="flex flex-col justify-center gap-8 h-full py-12">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={16} className="text-[#1A365D]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] opacity-60">MaRRS International Series</span>
              </div>
              <h2 className="text-6xl font-bold tracking-tighter leading-[0.9] text-[#1A365D] border-l-4 border-[#D69E2E] pl-6 py-2 uppercase">
                Bee Arena<br/>Practice Hub
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-[#2D3748]/70">
                Master professional spelling mechanics. Practice high-frequency vocabulary and phonetics in an industry-standard competition environment.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 auto-rows-fr">
              {rounds.map(round => (
                <RoundCard 
                  key={round.id}
                  id={round.label}
                  title={round.title}
                  desc="Competitive Training Module"
                  icon={round.icon}
                  onClick={() => setActiveRound(round.id as Round)}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-8 bg-[#F7FAFC]">
      <div className="w-full max-w-[1200px] h-full max-h-[800px] bg-white border-2 border-[#1A365D] grid grid-cols-[280px_1fr] shadow-2xl overflow-hidden rounded-sm">
        {/* Sidebar */}
        <aside className="bg-[#1A365D] text-white p-6 flex flex-col h-full">
          <div className="border-b border-white/10 pb-5 mb-8">
            <div className="text-[1.2rem] font-extrabold tracking-widest text-[#D69E2E] uppercase">Spell Bee</div>
            <div className="text-[0.7rem] opacity-70 mt-1 uppercase tracking-tighter">Arena Practice Module</div>
          </div>

          <nav className="flex flex-col gap-3">
            {rounds.map((round) => (
              <button
                key={round.id}
                onClick={() => setActiveRound(round.id as Round)}
                className={cn(
                  "p-4 border transition-all text-left flex justify-between items-center group",
                  activeRound === round.id 
                    ? "bg-white text-[#1A365D] border-white font-bold" 
                    : "border-white/10 text-white/80 hover:bg-white/5"
                )}
              >
                <div>
                  <div className="text-[0.65rem] uppercase tracking-widest opacity-60 mb-1">{round.label}</div>
                  <div className="text-sm uppercase tracking-tight">{round.title}</div>
                </div>
                {activeRound === round.id && <div className="w-2 h-2 rounded-full bg-[#D69E2E]" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] uppercase opacity-40 font-mono tracking-widest">Global Score</span>
              <span className="font-mono text-xl leading-none font-bold text-[#D69E2E] tabular-nums">
                {totalScore.toString().padStart(4, '0')}
              </span>
            </div>
            <div className="h-1 bg-white/10 relative overflow-hidden">
               <motion.div 
                className="absolute inset-0 bg-[#D69E2E]" 
                animate={{ width: `${Math.min(100, (totalScore / 500) * 100)}%` }}
               />
            </div>
          </div>
        </aside>

        {/* Main Stage */}
        <main className="h-full relative overflow-hidden bg-white px-10 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRound || 'menu'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-y-auto pr-2 custom-scrollbar"
            >
              {renderArena()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function RoundCard({ id, title, desc, icon, onClick }: { id: string, title: string, desc: string, icon: ReactNode, onClick: () => void, key?: any }) {
  return (
    <button 
      onClick={onClick}
      className="group flex flex-col justify-between p-6 border border-[#E2E8F0] transition-all hover:border-[#1A365D] hover:shadow-lg relative overflow-hidden text-left bg-white"
    >
      <div className="absolute -right-4 -top-4 opacity-[0.05] scale-[4] group-hover:opacity-[0.1] transition-opacity text-[#1A365D]">
        {icon}
      </div>
      <div>
        <span className="font-mono text-[10px] opacity-40 block mb-1 text-[#1A365D] font-bold">{id}</span>
        <h3 className="text-xl font-black tracking-tighter uppercase text-[#1A365D]">{title}</h3>
      </div>
      <div className="flex items-end justify-between mt-4">
        <p className="text-[9px] uppercase tracking-tight text-[#2D3748]/60 leading-tight max-w-[100px]">
          {desc}
        </p>
        <div className="w-8 h-8 flex items-center justify-center text-[#1A365D]">
          <ChevronLeft className="rotate-180" size={16} />
        </div>
      </div>
    </button>
  );
}
