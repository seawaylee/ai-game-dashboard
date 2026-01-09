import React from 'react';
import { UltramanConfig } from '../types';
import { X, Volume2 } from 'lucide-react';
import { speakText } from '../services/tts';

interface RosterListProps {
  isOpen: boolean;
  onClose: () => void;
  configs: Record<string, UltramanConfig>;
}

const RosterList: React.FC<RosterListProps> = ({ isOpen, onClose, configs }) => {
  if (!isOpen) return null;

  const playSound = (config: UltramanConfig) => {
    speakText(`${config.name}`, config.pitch);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-gray-900 h-full overflow-y-auto p-6 shadow-2xl border-l border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500">奥特曼图鉴</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-white">
            <X size={24} />
          </button>
        </div>

        <div className="grid gap-4">
          {Object.values(configs).map((config: UltramanConfig) => {
             return (
                <div key={config.id} className="bg-gray-800 p-4 rounded-xl flex items-center space-x-4 border border-gray-700 hover:border-orange-500 transition-colors">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 shrink-0 border-2 border-orange-500/50 relative">
                      {config.imageUrl ? (
                          <img src={config.imageUrl} alt={config.name} className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-600 text-xs text-center p-1 text-gray-400">
                              No Image
                          </div>
                      )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-orange-400 font-mono mb-1">按键: {config.id}</div>
                    <h3 className="font-bold text-lg leading-tight text-white">{config.name}</h3>
                  </div>
                  <button 
                    onClick={() => playSound(config)}
                    className="p-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white transition-colors"
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default RosterList;
