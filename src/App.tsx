import React, { useState } from 'react';
import { Setup } from './components/Setup';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { Question, SetupData } from './types';
import { Dices } from 'lucide-react';

type GameState = 'setup' | 'playing' | 'finished';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [finalStats, setFinalStats] = useState({ score: 0, correct: 0, wrong: 0 });

  const handleStart = async (data: SetupData) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Falha ao gerar');
      }
      
      const result = await response.json();
      setQuestions(result.questions);
      setGameState('playing');
    } catch (error: any) {
      console.error(error);
      alert(`Ocorreu um erro ao gerar as perguntas: ${error.message || 'Verifique o console.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinish = (score: number, correct: number, wrong: number) => {
    setFinalStats({ score, correct, wrong });
    setGameState('finished');
  };

  const handleRestart = () => {
    setGameState('setup');
    setQuestions([]);
    setFinalStats({ score: 0, correct: 0, wrong: 0 });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col">
      <header className="flex items-center gap-3 mb-12 max-w-4xl mx-auto w-full">
        <div className="p-2 bg-game-accent rounded-lg text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <Dices className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-display font-bold text-white tracking-tight">
          Roleta do Conhecimento
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        {gameState === 'setup' && (
          <Setup onStart={handleStart} isGenerating={isGenerating} />
        )}
        
        {gameState === 'playing' && (
          <GameScreen questions={questions} onFinish={handleFinish} />
        )}
        
        {gameState === 'finished' && (
          <ResultScreen 
            score={finalStats.score}
            correct={finalStats.correct}
            wrong={finalStats.wrong}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
