import React, { useState, useEffect, useCallback, useRef } from 'react';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import Controls from './components/Controls';
import WinCelebration from './components/WinCelebration';
import { BoardState, GameMode, GameStatus, Player, Score, Difficulty } from './types';
import { BOARD_SIZE, ASSETS } from './constants';
import { createEmptyBoard, checkWin, getBestMove } from './services/gameLogic';
import { soundEngine } from './services/soundEngine';

const App: React.FC = () => {
  // Game State
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.Black);
  const [status, setStatus] = useState<GameStatus>(GameStatus.Playing);
  const [score, setScore] = useState<Score>({ p1: 0, p2: 0 });
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PvC);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [history, setHistory] = useState<{ board: BoardState, player: Player }[]>([]);
  const [lastMove, setLastMove] = useState<{ row: number, col: number } | null>(null);
  
  // UI State
  const [showCelebration, setShowCelebration] = useState(false);
  const winTimeoutRef = useRef<number | null>(null);

  // Appearance
  const [p1Asset, setP1Asset] = useState<string>(ASSETS[0].id); // Steve default
  const [p2Asset, setP2Asset] = useState<string>(ASSETS[4].id); // Creeper default

  // Simple Theme Data
  const theme = {
    id: 'custom',
    name: 'Custom',
    boardColor: '#6D4C34',
    gridColor: 'rgba(0, 0, 0, 0.2)',
    p1: '', p2: ''
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (winTimeoutRef.current) {
        clearTimeout(winTimeoutRef.current);
      }
    };
  }, []);

  // AI Move Effect
  useEffect(() => {
    if (gameMode === GameMode.PvC && currentPlayer === Player.White && status === GameStatus.Playing) {
      const timer = setTimeout(() => {
        const move = getBestMove(board, Player.White, difficulty);
        if (move) {
          handleMove(move.row, move.col, true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, status, gameMode, board, difficulty]);

  // Handle click / init sound
  const handleInteraction = () => {
     soundEngine.init();
  };

  const handleMove = useCallback((row: number, col: number, isAi: boolean = false) => {
    if (status !== GameStatus.Playing) return;
    if (board[row][col] !== Player.None) return;
    if (gameMode === GameMode.PvC && currentPlayer === Player.White && !isAi) return; 

    // Sound
    soundEngine.playPlaceSound();

    // History
    setHistory(prev => [...prev, { board: JSON.parse(JSON.stringify(board)), player: currentPlayer }]);

    // Update
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setLastMove({ row, col });

    // Check Win
    if (checkWin(newBoard, row, col, currentPlayer)) {
      setStatus(GameStatus.Won);
      updateScore(currentPlayer);
      soundEngine.playWinSound();
      
      // Delay showing the celebration so user can see the winning move
      if (winTimeoutRef.current) clearTimeout(winTimeoutRef.current);
      winTimeoutRef.current = window.setTimeout(() => {
        setShowCelebration(true);
      }, 1500);

    } else if (newBoard.flat().every(cell => cell !== Player.None)) {
      setStatus(GameStatus.Draw);
    } else {
      setCurrentPlayer(prev => prev === Player.Black ? Player.White : Player.Black);
    }
  }, [board, currentPlayer, gameMode, status]);

  const updateScore = (winner: Player) => {
    setScore(prev => ({
      p1: winner === Player.Black ? prev.p1 + 1 : prev.p1,
      p2: winner === Player.White ? prev.p2 + 1 : prev.p2,
    }));
  };

  const resetGame = () => {
    if (winTimeoutRef.current) clearTimeout(winTimeoutRef.current);
    setShowCelebration(false);
    setBoard(createEmptyBoard());
    setCurrentPlayer(Player.Black);
    setStatus(GameStatus.Playing);
    setHistory([]);
    setLastMove(null);
  };

  const undoMove = () => {
    if (history.length === 0 || status === GameStatus.Won) return;
    let steps = 1;
    if (gameMode === GameMode.PvC && currentPlayer === Player.Black) steps = 2;
    if (history.length < steps) return;

    const targetStateIndex = history.length - steps;
    const previousState = history[targetStateIndex];
    setHistory(prev => prev.slice(0, targetStateIndex));
    setBoard(previousState.board);
    setCurrentPlayer(previousState.player);
    setStatus(GameStatus.Playing);
    setLastMove(null);
  };

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
    setScore({ p1: 0, p2: 0 });
  };

  const diffMap: Record<string, string> = {
    [Difficulty.Easy]: '简单',
    [Difficulty.Medium]: '普通',
    [Difficulty.Hard]: '困难'
  };

  return (
    <div 
      className="min-h-screen bg-[#2e2e2e] flex flex-col items-center justify-start py-8 px-4 font-sans select-none overflow-x-hidden"
      onClick={handleInteraction} // Init audio on any click
    >
      
      <h1 className="text-4xl md:text-6xl text-white font-pixel mb-6 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] text-center tracking-wider">
        <span className="text-[#7cba52]">我的世界</span>
        <span className="text-[#a0a0a0]">五子棋</span>
      </h1>

      <ScoreBoard 
        score={score} 
        currentPlayer={currentPlayer} 
        status={status}
        gameMode={gameMode}
        p1Asset={p1Asset}
        p2Asset={p2Asset}
      />

      <div className="relative group">
        <Board 
          board={board} 
          onCellClick={(r, c) => handleMove(r, c)} 
          lastMove={lastMove}
          theme={theme}
          isActive={status === GameStatus.Playing}
          p1Asset={p1Asset}
          p2Asset={p2Asset}
        />
        
        {/* Win Animation Overlay */}
        {showCelebration && (
           <WinCelebration 
             winner={currentPlayer} 
             winnerAssetId={currentPlayer === Player.Black ? p1Asset : p2Asset}
             onReset={resetGame}
           />
        )}
      </div>

      <div className="mt-8 w-full max-w-[600px]">
        <Controls 
          onReset={resetGame}
          onUndo={undoMove}
          onModeChange={handleModeChange}
          onDifficultyChange={setDifficulty}
          onAssetChange={(p, id) => p === 'p1' ? setP1Asset(id) : setP2Asset(id)}
          currentMode={gameMode}
          currentDifficulty={difficulty}
          p1Asset={p1Asset}
          p2Asset={p2Asset}
          canUndo={history.length > 0 && status === GameStatus.Playing}
        />
      </div>

      <div className="text-white/30 text-xs font-pixel mt-4">
        点击任意位置开启音效 • 50+ 种像素素材 • 难度: {diffMap[difficulty]}
      </div>

    </div>
  );
};

export default App;
