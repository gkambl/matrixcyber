import React, { useState, useEffect } from 'react';
import { Shield, Play, Pause, RotateCcw, Settings, Info, Trophy } from 'lucide-react';
import GameModeSelector from './components/GameModeSelector';
import LevelSelector from './components/LevelSelector';
import TowerDefenseGame from './components/TowerDefenseGame';
import HowToPlay from './components/HowToPlay';
import GameOver from './components/GameOver';
import { gameLevels } from './data/gameLevels';
import { GameState, GameMode, Difficulty, GameStats } from './types/game';

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('campaign');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [levelProgress, setLevelProgress] = useState<{ [levelId: number]: number }>({});
  const [correctAnswersInLevel, setCorrectAnswersInLevel] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  
  const [gameStats, setGameStats] = useState<GameStats>({
    totalScore: 0,
    enemiesDefeated: 0,
    quizzesCompleted: 0,
    quizAccuracy: 0,
    levelsCompleted: 0,
    timePlayedMinutes: 0
  });

  const [sessionStats, setSessionStats] = useState({
    score: 0,
    lives: 20,
    wave: 1,
    startTime: Date.now()
  });

  const startGame = () => {
    setGameState('playing');
    setCorrectAnswersInLevel(0);
    setSessionStats({
      score: 0,
      lives: gameMode === 'survival' ? 10 : 20,
      wave: 1,
      startTime: Date.now()
    });
  };

  const pauseGame = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  const resetGame = () => {
    setGameState('menu');
    setCurrentLevel(1);
    setCorrectAnswersInLevel(0);
  };

  const handleLevelSelect = (levelId: number) => {
    setCurrentLevel(levelId);
    setShowLevelSelector(false);
    startGame();
  };

  const handleQuizCorrect = () => {
    const newCorrectAnswers = correctAnswersInLevel + 1;
    setCorrectAnswersInLevel(newCorrectAnswers);
    
    // Update level progress
    setLevelProgress(prev => ({
      ...prev,
      [currentLevel]: (newCorrectAnswers / 5) * 100
    }));
    
    // Check if level is complete (5 correct answers)
    if (newCorrectAnswers >= 5 && !completedLevels.includes(currentLevel)) {
      setCompletedLevels(prev => [...prev, currentLevel]);
      
      // Auto-advance to next level if available
      if (currentLevel < gameLevels.length) {
        setTimeout(() => {
          setCurrentLevel(prev => prev + 1);
          setCorrectAnswersInLevel(0);
        }, 2000);
      }
    }
  };
  const handleScoreUpdate = (score: number) => {
    setSessionStats(prev => ({ ...prev, score }));
  };

  const handleLivesUpdate = (lives: number) => {
    setSessionStats(prev => ({ ...prev, lives }));
  };

  const handleWaveUpdate = (wave: number) => {
    setSessionStats(prev => ({ ...prev, wave }));
  };

  useEffect(() => {
    if (sessionStats.lives <= 0) {
      setGameState('gameOver');
      
      // Update overall game stats
      const sessionTime = Math.floor((Date.now() - sessionStats.startTime) / 60000);
      setGameStats(prev => ({
        ...prev,
        totalScore: prev.totalScore + sessionStats.score,
        timePlayedMinutes: prev.timePlayedMinutes + sessionTime
      }));
    }
  }, [sessionStats.lives, sessionStats.score, sessionStats.startTime]);

  const getGameModeDescription = () => {
    switch (gameMode) {
      case 'campaign':
        return `Level ${currentLevel}: Navigate the Digital Matrix`;
      case 'survival':
        return 'Infinite streams of malicious code';
      case 'training':
        return 'Hone your digital defense protocols';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="matrix-rain"></div>
      </div>
      
      {/* Header */}
      <header className="bg-black/80 border-b border-green-500/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-green-400 animate-pulse" />
              <div>
                <h1 className="text-2xl font-bold text-green-400 font-mono tracking-wider">MATRIX CYBER DEFENSE</h1>
                <p className="text-green-300 text-sm font-mono">
                  {gameState === 'menu' 
                    ? 'Master cyber security while defending the digital realm!'
                    : getGameModeDescription()
                  }
                </p>
              </div>
            </div>
            
            {(gameState === 'playing' || gameState === 'paused') ? (
              <div className="flex items-center space-x-6">
                <div className="text-right font-mono">
                  <div className="text-green-400 font-semibold">SCORE: {sessionStats.score.toLocaleString()}</div>
                  <div className="text-red-400">LIVES: {sessionStats.lives}</div>
                  <div className="text-cyan-400">WAVE: {sessionStats.wave}</div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={pauseGame}
                    className="flex items-center space-x-2 bg-green-900/50 hover:bg-green-800/50 border border-green-500/50 px-4 py-2 rounded transition-colors font-mono"
                  >
                    {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{gameState === 'playing' ? 'Pause' : 'Resume'}</span>
                  </button>
                  <button
                    onClick={resetGame}
                    className="flex items-center space-x-2 bg-red-900/50 hover:bg-red-800/50 border border-red-500/50 px-4 py-2 rounded transition-colors font-mono"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>EXIT</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-right text-sm font-mono">
                  <div className="text-green-400">TOTAL SCORE: {gameStats.totalScore.toLocaleString()}</div>
                  <div className="text-green-400">TIME ONLINE: {gameStats.timePlayedMinutes}m</div>
                </div>
                <button
                  onClick={() => setShowHowToPlay(true)}
                  className="flex items-center space-x-2 bg-green-900/50 hover:bg-green-800/50 border border-green-500/50 px-4 py-2 rounded transition-colors font-mono"
                >
                  <Info className="w-4 h-4" />
                  <span>PROTOCOLS</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {gameState === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                <Shield className="w-16 h-16 text-black" />
              </div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent font-mono tracking-wider">
                DEFEND THE MATRIX
              </h2>
              <p className="text-xl text-green-300 mb-8 max-w-3xl mx-auto font-mono">
                Experience an immersive cyber defense simulation while mastering essential security protocols. 
                Deploy digital defenses, neutralize Agent threats, and solve security challenges to become the ultimate cyber guardian!
              </p>
            </div>

            {!showLevelSelector ? (
              <GameModeSelector
                selectedMode={gameMode}
                onModeSelect={setGameMode}
                onStartGame={() => {
                  if (gameMode === 'campaign') {
                    setShowLevelSelector(true);
                  } else {
                    startGame();
                  }
                }}
              />
            ) : (
              <LevelSelector
                levels={gameLevels}
                currentLevel={currentLevel}
                completedLevels={completedLevels}
                playerProgress={levelProgress}
                onLevelSelect={handleLevelSelect}
              />
            )}
          </div>
        )}

        {(gameState === 'playing' || gameState === 'paused' || gameState === 'quiz') && (
          <TowerDefenseGame
            gameState={gameState}
            gameMode={gameMode}
            currentLevel={currentLevel}
            onGameStateChange={setGameState}
            onScoreUpdate={handleScoreUpdate}
            onLivesUpdate={handleLivesUpdate}
            onWaveUpdate={handleWaveUpdate}
            onQuizCorrect={handleQuizCorrect}
            correctAnswersInLevel={correctAnswersInLevel}
          />
        )}

        {gameState === 'gameOver' && (
          <GameOver
            score={sessionStats.score}
            wave={sessionStats.wave}
            gameMode={gameMode}
            onRestart={startGame}
            onMenu={resetGame}
          />
        )}
      </main>

      {/* Modals */}
      {showHowToPlay && (
        <HowToPlay onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}

export default App;
