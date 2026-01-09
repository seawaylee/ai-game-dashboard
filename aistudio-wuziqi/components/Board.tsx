import React from 'react';
import { BoardState, Player, GameTheme } from '../types';
import { McPiece } from './McPiece';
import { BOARD_SIZE } from '../constants';

interface BoardProps {
  board: BoardState;
  onCellClick: (row: number, col: number) => void;
  lastMove: { row: number, col: number } | null;
  theme: GameTheme;
  isActive: boolean;
  p1Asset: string;
  p2Asset: string;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, lastMove, theme, isActive, p1Asset, p2Asset }) => {
  return (
    <div className="relative p-2 md:p-4 rounded-none bg-black border-4 border-black inline-block shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
      {/* Board Background Container */}
      <div 
        className="grid gap-[1px]"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          backgroundColor: theme.gridColor,
          // Use min to ensure it fits screen, but fixed aspect ratio is handled by cell padding hack or aspect-ratio css
          width: 'min(90vw, 600px)',
          height: 'min(90vw, 600px)',
        }}
      >
        {board.map((row, rIndex) =>
          row.map((cell, cIndex) => {
            const isLastMove = lastMove?.row === rIndex && lastMove?.col === cIndex;
            
            return (
              <div
                key={`${rIndex}-${cIndex}`}
                className="relative w-full h-full bg-opacity-100"
                style={{ backgroundColor: theme.boardColor }}
              >
                {/* 
                   We use a div wrapper + absolute button to ensure the grid cell size is determined 
                   solely by the grid layout and doesn't expand when content is added 
                */}
                <button
                  onClick={() => onCellClick(rIndex, cIndex)}
                  disabled={!isActive || cell !== Player.None}
                  className={`
                    absolute inset-0 flex items-center justify-center
                    transition-all duration-75
                    ${cell === Player.None && isActive ? 'hover:bg-white/20 cursor-pointer' : ''}
                  `}
                >
                   {/* Inner Shadow for depth feeling on empty cells */}
                   {cell === Player.None && (
                     <div className="absolute inset-0 pointer-events-none shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]"></div>
                   )}

                   {/* Render Piece if present - Use 85% size to leave some breathing room */}
                   {cell === Player.Black && (
                     <div className="w-[85%] h-[85%] animate-[bounce_0.2s_ease-out]">
                       <McPiece assetId={p1Asset} />
                     </div>
                   )}
                   {cell === Player.White && (
                     <div className="w-[85%] h-[85%] animate-[bounce_0.2s_ease-out]">
                       <McPiece assetId={p2Asset} />
                     </div>
                   )}

                   {/* Last Move Indicator */}
                   {isLastMove && (
                     <div className="absolute inset-0 border-2 md:border-4 border-red-500 animate-pulse pointer-events-none z-10 box-border opacity-80" />
                   )}
                </button>
              </div>
            );
          })
        )}
      </div>
      
      {/* Decorative Border Corners (Minecraft Style) */}
      <div className="absolute -top-1 -left-1 w-4 h-4 bg-gray-300 border-r-2 border-b-2 border-gray-500"/>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 border-l-2 border-b-2 border-gray-500"/>
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gray-300 border-r-2 border-t-2 border-gray-500"/>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-300 border-l-2 border-t-2 border-gray-500"/>
    </div>
  );
};

export default Board;
