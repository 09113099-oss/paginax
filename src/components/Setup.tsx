import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Play, Target, Users, BookOpen, Layers } from 'lucide-react';
import { SetupData } from '../types';

interface SetupProps {
  onStart: (data: SetupData) => void;
  isGenerating: boolean;
}

export function Setup({ onStart, isGenerating }: SetupProps) {
  const [data, setData] = useState<SetupData>({
    theme: '',
    audience: '',
    level: '',
    mandatory: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(data);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto bg-game-card rounded-2xl shadow-2xl p-8 border border-white/10"
    >
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div className="p-3 bg-game-accent/20 rounded-xl text-game-accent">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Configurar Roleta</h2>
          <p className="text-slate-400 mt-1">Defina os parâmetros para gerar as perguntas</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Target className="w-4 h-4 text-game-accent" />
            1. Qual é o tema da roleta?
          </label>
          <input
            required
            type="text"
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-game-accent focus:ring-1 focus:ring-game-accent transition-all"
            placeholder="Ex: História do Brasil, Programação em React, Mitologia..."
            value={data.theme}
            onChange={(e) => setData({ ...data, theme: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Users className="w-4 h-4 text-game-accent" />
            2. Qual é o público-alvo?
          </label>
          <input
            required
            type="text"
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-game-accent focus:ring-1 focus:ring-game-accent transition-all"
            placeholder="Ex: Alunos do ensino médio, Desenvolvedores juniores..."
            value={data.audience}
            onChange={(e) => setData({ ...data, audience: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Layers className="w-4 h-4 text-game-accent" />
            3. Qual é o nível de conhecimento?
          </label>
          <input
            required
            type="text"
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-game-accent focus:ring-1 focus:ring-game-accent transition-all"
            placeholder="Ex: Iniciante, Intermediário, Avançado..."
            value={data.level}
            onChange={(e) => setData({ ...data, level: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <BookOpen className="w-4 h-4 text-game-accent" />
            4. Conteúdos obrigatórios (Opcional)
          </label>
          <textarea
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-game-accent focus:ring-1 focus:ring-game-accent transition-all"
            placeholder="Ex: Precisa incluir 3 perguntas sobre X..."
            rows={3}
            value={data.mandatory}
            onChange={(e) => setData({ ...data, mandatory: e.target.value })}
          />
        </div>

        <button
          disabled={isGenerating}
          type="submit"
          className="w-full py-4 mt-4 bg-game-accent hover:bg-game-accent/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Settings className="w-5 h-5" />
              </motion.div>
              Gerando Perguntas com IA...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Gerar Roleta e Iniciar
            </span>
          )}
        </button>
      </form>
    </motion.div>
  );
}
