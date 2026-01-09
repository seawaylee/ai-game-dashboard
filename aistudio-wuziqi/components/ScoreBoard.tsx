import React from 'react';
import { Player, Score, GameStatus } from '../types';
import { McPiece } from './McPiece';
import { Trophy, Swords, Cpu, User } from 'lucide-react';

interface ScoreBoardProps {
  score: Score;
  currentPlayer: Player;
  status: GameStatus;
  gameMode: string;
  p1Asset: string;
  p2Asset: string;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, currentPlayer, status, gameMode, p1Asset, p2Asset }) => {
  const isP1Turn = currentPlayer === Player.Black && status === GameStatus.Playing;
  const isP2Turn = currentPlayer === Player.White && status === GameStatus.Playing;

  return (
    <div className="w-full max-w-[600px] flex justify-between items-center mb-6 bg-mc-stone p-1 border-4 border-black shadow-block">
      
      {/* Player 1 */}
      <div className={`flex items-center gap-3 p-3 transition-colors duration-300 ${isP1Turn ? 'bg-white/10' : ''} min-w-[120px]`}>
        <div className="w-12 h-12 relative">
          <McPiece assetId={p1Asset} />
          {isP1Turn && <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">▼</div>}
        </div>
        <div className="flex flex-col font-pixel hidden md:flex">
          <span className="text-white text-xl flex items-center gap-1">
            <User size={16}/> 玩家 1
          </span>
          <span className="text-mc-gold text-2xl drop-shadow-md">分数: {score.p1}</span>
        </div>
        {/* Mobile Score Compact */}
        <div className="flex flex-col font-pixel md:hidden">
           <span className="text-mc-gold text-2xl">{score.p1}</span>
        </div>
      </div>

      {/* VS / Status */}
      <div className="flex flex-col items-center justify-center px-4">
        {status === GameStatus.Playing ? (
          <Swords className="text-gray-400 w-8 h-8" />
        ) : (
          <Trophy className="text-yellow-400 w-10 h-10 animate-pulse" />
        )}
        <span className="text-white/60 font-pixel text-sm mt-1">{gameMode === 'PvC' ? '人机对战' : '双人对战'}</span>
      </div>

      {/* Player 2 */}
      <div className={`flex items-center flex-row-reverse gap-3 p-3 transition-colors duration-300 ${isP2Turn ? 'bg-white/10' : ''} min-w-[120px] text-right`}>
        <div className="w-12 h-12 relative">
          <McPiece assetId={p2Asset} />
          {isP2Turn && <div className="absolute -top-2 -left-2 text-yellow-400 animate-bounce">▼</div>}
        </div>
        <div className="flex flex-col font-pixel hidden md:flex">
          <span className="text-white text-xl flex items-center justify-end gap-1">
            {gameMode === 'PvC' ? <Cpu size={16} /> : <User size={16} />} {gameMode === 'PvC' ? '电脑' : '玩家 2'}
          </span>
          <span className="text-mc-gold text-2xl drop-shadow-md">分数: {score.p2}</span>
        </div>
        {/* Mobile Score Compact */}
        <div className="flex flex-col font-pixel md:hidden">
           <span className="text-mc-gold text-2xl">{score.p2}</span>
        </div>
      </div>

    </div>
  );
};

export default ScoreBoard;
