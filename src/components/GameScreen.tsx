import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { HelpCircle, CheckCircle, XCircle, ChevronRight, Award, AlertTriangle, Lightbulb } from 'lucide-react';

interface GameScreenProps {
  questions: Question[];
  onFinish: (score: number, correct: number, wrong: number) => void;
}

export function GameScreen({ questions, onFinish }: GameScreenProps) {
  const [availableSlots, setAvailableSlots] = useState<number[]>(Array.from({ length: 20 }, (_, i) => i + 1));
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningNumber, setSpinningNumber] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [helpUsed, setHelpUsed] = useState(false);

  const spinRoulette = () => {
    if (availableSlots.length === 0) {
      onFinish(score, correct, wrong);
      return;
    }

    setIsSpinning(true);
    setCurrentQuestion(null);
    setShowAnswer(false);
    setHelpUsed(false);

    let spins = 0;
    const maxSpins = 20;
    
    const interval = setInterval(() => {
      const randomDisplay = Math.floor(Math.random() * 20) + 1;
      setSpinningNumber(randomDisplay);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * availableSlots.length);
        const selectedNumber = availableSlots[randomIndex];
        const selectedQ = questions.find(q => q.number === selectedNumber);
        
        setSpinningNumber(selectedNumber);
        setAvailableSlots(prev => prev.filter(n => n !== selectedNumber));
        
        setTimeout(() => {
          setCurrentQuestion(selectedQ || null);
          setIsSpinning(false);
        }, 1000);
      }
    }, 100);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + (currentQuestion?.points || 0));
      setCorrect(prev => prev + 1);
    } else {
      setScore(prev => prev - (currentQuestion?.penalty || 0));
      setWrong(prev => prev + 1);
    }
    setShowAnswer(true);
  };

  const nextRound = () => {
    if (availableSlots.length === 0) {
      onFinish(score, correct, wrong);
    } else {
      setCurrentQuestion(null);
      setSpinningNumber(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header / Scoreboard */}
      <div className="flex items-center justify-between bg-game-card rounded-2xl p-6 mb-8 border border-white/10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-game-accent rounded-full flex items-center justify-center text-xl font-bold">
            GM
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Game Master</h3>
            <p className="text-sm text-slate-400">{availableSlots.length} rodadas restantes</p>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-3xl font-display font-bold text-emerald-400">{score}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Pontos</div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex gap-4">
            <div className="text-emerald-500 flex flex-col items-center">
              <CheckCircle className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">{correct}</span>
            </div>
            <div className="text-rose-500 flex flex-col items-center">
              <XCircle className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">{wrong}</span>
            </div>
          </div>
        </div>
      </div>

      {!currentQuestion ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-game-card rounded-3xl p-12 text-center border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-game-accent/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl font-display font-bold mb-8">
              {isSpinning ? "Rodando a Roleta..." : "Pronto para a próxima casa?"}
            </h2>
            
            <div className="w-48 h-48 mx-auto border-8 border-game-accent rounded-full flex items-center justify-center text-7xl font-display font-black bg-slate-900 shadow-[0_0_50px_rgba(139,92,246,0.3)] mb-8">
              {spinningNumber !== null ? spinningNumber : "?"}
            </div>

            {!isSpinning && (
              <button
                onClick={spinRoulette}
                className="px-12 py-4 bg-game-accent hover:bg-game-accent/90 text-white font-bold text-xl rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(139,92,246,0.5)]"
              >
                Girar Roleta
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-game-card rounded-3xl p-8 border border-white/10 shadow-2xl relative"
        >
          {/* Question Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-slate-800 rounded-full text-lg font-bold font-display">
              Casa {currentQuestion.number}
            </span>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
              currentQuestion.difficulty === 'Fácil' ? 'bg-emerald-500/20 text-emerald-400' :
              currentQuestion.difficulty === 'Média' ? 'bg-amber-500/20 text-amber-400' :
              'bg-rose-500/20 text-rose-400'
            }`}>
              {currentQuestion.difficulty}
            </span>
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-bold flex items-center gap-1">
              <Award className="w-4 h-4" /> +{currentQuestion.points}
            </span>
            {currentQuestion.penalty > 0 && (
              <span className="px-4 py-1.5 bg-rose-500/10 text-rose-400 rounded-full text-sm font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> -{currentQuestion.penalty}
              </span>
            )}
          </div>

          <div className="text-2xl leading-relaxed font-medium mb-8">
            {currentQuestion.question}
          </div>

          {currentQuestion.help && !showAnswer && (
            <div className="mb-8">
              {!helpUsed ? (
                <button 
                  onClick={() => setHelpUsed(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-500/20 text-indigo-300 rounded-xl hover:bg-indigo-500/30 transition-colors"
                >
                  <HelpCircle className="w-5 h-5" />
                  Usar Recurso de Ajuda Disponível
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-start gap-3"
                >
                  <Lightbulb className="w-6 h-6 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-indigo-300 mb-1">Ajuda Ativada</h4>
                    <p className="text-indigo-200">{currentQuestion.help}</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          <AnimatePresence>
            {!showAnswer ? (
              <motion.div exit={{ opacity: 0, height: 0 }} className="flex gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  O Jogador Acertou!
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  O Jogador Errou
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="p-6 bg-slate-800 rounded-2xl mb-6 border border-white/10">
                  <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Resposta Correta</h4>
                  <p className="text-xl text-emerald-400">{currentQuestion.answer}</p>
                </div>
                
                <button
                  onClick={nextRound}
                  className="w-full py-4 bg-game-accent hover:bg-game-accent/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  Próxima Rodada <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
