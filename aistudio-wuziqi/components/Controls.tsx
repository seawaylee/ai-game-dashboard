import React from 'react';
import { GameMode, Difficulty } from '../types';
import { ASSETS } from '../constants';
import { RotateCcw, Undo2, User, Monitor, Brain, Shirt } from 'lucide-react';
import { McPiece } from './McPiece';

interface ControlsProps {
  onReset: () => void;
  onUndo: () => void;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (diff: Difficulty) => void;
  onAssetChange: (player: 'p1' | 'p2', assetId: string) => void;
  currentMode: GameMode;
  currentDifficulty: Difficulty;
  p1Asset: string;
  p2Asset: string;
  canUndo: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  onReset, 
  onUndo, 
  onModeChange, 
  onDifficultyChange,
  onAssetChange,
  currentMode,
  currentDifficulty,
  p1Asset,
  p2Asset,
  canUndo 
}) => {
  
  const btnClass = (active: boolean) => `
    flex items-center justify-center gap-2 px-3 py-2 
    font-pixel text-lg text-white
    border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1
    transition-all select-none
    ${active 
      ? 'bg-[#7cba52] border-[#2e5218] shadow-pixel-pressed' 
      : 'bg-[#7d7d7d] border-[#383838] shadow-pixel hover:bg-[#8d8d8d]'}
  `;

  // Difficulty Translation Map
  const diffMap: Record<string, string> = {
    [Difficulty.Easy]: '简单',
    [Difficulty.Medium]: '普通',
    [Difficulty.Hard]: '困难'
  };

  // Helper for asset selector
  const AssetSelect = ({ value, onChange, label }: { value: string, onChange: (v: string) => void, label: string }) => (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-white/70 font-pixel text-xs flex items-center gap-1">
        <Shirt size={10} /> {label}
      </label>
      <div className="relative group">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#383838] text-white font-pixel border-2 border-black p-1 pl-8 outline-none cursor-pointer hover:bg-[#484848] appearance-none"
        >
          {ASSETS.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <div className="absolute left-1 top-1 w-6 h-6 pointer-events-none">
          <McPiece assetId={value} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[600px] flex flex-col gap-4 mb-6">
      
      {/* Top Row: Primary Actions */}
      <div className="flex gap-4 justify-center">
         <button onClick={onReset} className={btnClass(false)}>
           <RotateCcw size={18} /> 重置游戏
         </button>
         
         <button onClick={onUndo} disabled={!canUndo} className={`${btnClass(false)} ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}>
           <Undo2 size={18} /> 悔棋
         </button>
      </div>

      {/* Settings Grid */}
      <div className="bg-[#4a4a4a] p-4 border-4 border-black shadow-block flex flex-col gap-4">
        
        {/* Row 1: Mode & Difficulty */}
        <div className="flex items-center justify-between gap-4 border-b-2 border-black/20 pb-4">
          <div className="flex items-center gap-2">
             <button onClick={() => onModeChange(GameMode.PvC)} className={`${btnClass(currentMode === GameMode.PvC)} !py-1 !px-2 text-sm`}>
               <Monitor size={14} /> 人机
             </button>
             <button onClick={() => onModeChange(GameMode.PvP)} className={`${btnClass(currentMode === GameMode.PvP)} !py-1 !px-2 text-sm`}>
               <User size={14} /> 双人
             </button>
          </div>

          {currentMode === GameMode.PvC && (
             <div className="flex items-center gap-2">
               <Brain size={16} className="text-white/70" />
               <select 
                 value={currentDifficulty}
                 onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
                 className="bg-[#383838] text-white font-pixel border-2 border-black p-1 text-sm outline-none"
               >
                 {Object.values(Difficulty).map(d => <option key={d} value={d}>{diffMap[d]}</option>)}
               </select>
             </div>
          )}
        </div>

        {/* Row 2: Character Selection */}
        <div className="flex gap-4">
           <AssetSelect value={p1Asset} onChange={(v) => onAssetChange('p1', v)} label="玩家 1" />
           <AssetSelect value={p2Asset} onChange={(v) => onAssetChange('p2', v)} label={currentMode === GameMode.PvC ? '电脑' : '玩家 2'} />
        </div>

      </div>
    </div>
  );
};

export default Controls;
