import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, RefreshCcw } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  correct: number;
  wrong: number;
  onRestart: () => void;
}

export function ResultScreen({ score, correct, wrong, onRestart }: ResultScreenProps) {
  const getClassification = (score: number) => {
    if (score <= 40) return { title: 'Iniciante', color: 'text-slate-400' };
    if (score <= 120) return { title: 'Aprendiz', color: 'text-emerald-400' };
    if (score <= 220) return { title: 'Especialista', color: 'text-blue-400' };
    if (score <= 320) return { title: 'Mestre', color: 'text-purple-400' };
    return { title: 'Lenda da Roleta', color: 'text-amber-400' };
  };

  const classification = getClassification(score);
  const total = correct + wrong;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-2xl mx-auto bg-game-card rounded-3xl p-12 text-center border border-white/10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-game-accent/20 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <Trophy className="w-24 h-24 mx-auto text-game-accent mb-6" />
        <h2 className="text-4xl font-display font-bold mb-2">Fim de Jogo!</h2>
        <p className="text-slate-400 mb-8">Veja seu desempenho na Roleta do Conhecimento</p>

        <div className="bg-slate-900/50 rounded-2xl p-8 mb-8 border border-white/5">
          <div className="text-7xl font-display font-black text-white mb-2">{score}</div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Pontos Totais</div>

          <div className={`text-3xl font-display font-bold mb-8 ${classification.color}`}>
            {classification.title}
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-1">{correct}</div>
              <div className="text-xs text-slate-400 uppercase font-medium">Acertos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-rose-400 mb-1">{wrong}</div>
              <div className="text-xs text-slate-400 uppercase font-medium">Erros</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-1">{percentage}%</div>
              <div className="text-xs text-slate-400 uppercase font-medium">Aproveitamento</div>
            </div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          Jogar Novamente
        </button>
      </div>
    </motion.div>
  );
}
