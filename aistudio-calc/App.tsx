
import React, { useState, useEffect } from 'react';
import { UltramanConfig, CalculatorState, ULTRAMAN_DATA } from './types';
import CalculatorButton from './components/CalculatorButton';
import { speakText } from './services/tts';
import { playUltramanShuatch, playBeamSound, playTimerSound } from './services/audioResources';
import { RefreshCw, Trash2, Zap } from 'lucide-react';
import { AVATAR_FILES } from './avatarFiles';

const KEYS = ['AC', '+/-', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='];

export default function App() {
  // --- State ---
  const [configs, setConfigs] = useState<Record<string, UltramanConfig>>({});

  // Load history from local storage to persist across reloads
  const [historyLog, setHistoryLog] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ultra-calc-history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem('ultra-calc-history', JSON.stringify(historyLog));
  }, [historyLog]);

  const [calcState, setCalcState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: null,
    operator: null,
    history: '',
    waitingForOperand: false
  });

  // --- Logic ---
  const clearHistory = () => {
    setHistoryLog([]);
  };

  const randomizeUltramen = async () => {
    if (Object.keys(configs).length > 0) {
      playUltramanShuatch();
    }

    const newConfigs: Record<string, UltramanConfig> = {};

    // Randomly select from actual avatar files
    for (let i = 0; i < KEYS.length; i++) {
      const key = KEYS[i];
      const uData = ULTRAMAN_DATA[Math.floor(Math.random() * ULTRAMAN_DATA.length)];

      // Pick a random file from the actual avatar files list
      const randomFileName = AVATAR_FILES[Math.floor(Math.random() * AVATAR_FILES.length)];
      const localAssetUrl = `/avatars/${randomFileName}`;

      const pitch = 0.6 + Math.random() * 0.3; // Deeper voice
      newConfigs[key] = {
        id: key,
        name: uData.name,
        color: uData.color,
        imageUrl: localAssetUrl,
        pitch: pitch,
        isGenerating: false
      };
    }

    setConfigs(newConfigs);

    if (Object.keys(configs).length > 0) {
      setTimeout(() => {
        speakText("光之国，集结！", 0.7);
      }, 500);
    }
  };


  // Initial setup
  useEffect(() => {
    randomizeUltramen();
  }, []);

  const handlePress = (btn: string) => {
    const config = configs[btn];

    if (config) {
      speakText(btn, config.pitch);
    }

    if (btn === 'AC') {
      playTimerSound();
      setCalcState({
        currentValue: '0',
        previousValue: null,
        operator: null,
        history: '',
        waitingForOperand: false
      });
      return;
    }

    if (btn === '=') {
      if (calcState.operator && calcState.previousValue) {
        const prev = parseFloat(calcState.previousValue);
        const current = parseFloat(calcState.currentValue);
        let result = 0;
        switch (calcState.operator) {
          case '+': result = prev + current; break;
          case '-': result = prev - current; break;
          case '*': result = prev * current; break;
          case '/': result = prev / current; break;
        }

        const resultString = String(parseFloat(result.toFixed(8)));

        // Play Beam Sound for result!
        playBeamSound();

        // Result Voice - 800ms delay
        setTimeout(() => {
          speakText(resultString, 0.6, 0.9);
        }, 800);

        const logEntry = `${calcState.previousValue} ${calcState.operator} ${calcState.currentValue} = ${resultString}`;
        setHistoryLog(prev => [...prev.slice(-19), logEntry]);

        setCalcState({
          currentValue: resultString,
          previousValue: null,
          operator: null,
          history: '',
          waitingForOperand: true
        });
      }
      return;
    }

    if (['+', '-', '*', '/'].includes(btn)) {
      if (calcState.operator && !calcState.waitingForOperand) {
        const prev = parseFloat(calcState.previousValue || '0');
        const current = parseFloat(calcState.currentValue);
        let result = 0;
        switch (calcState.operator) {
          case '+': result = prev + current; break;
          case '-': result = prev - current; break;
          case '*': result = prev * current; break;
          case '/': result = prev / current; break;
        }
        const resultString = String(parseFloat(result.toFixed(8)));
        setCalcState({
          previousValue: resultString,
          currentValue: resultString,
          operator: btn,
          history: resultString + ' ' + btn,
          waitingForOperand: true
        });
      } else {
        setCalcState({
          previousValue: calcState.currentValue,
          currentValue: calcState.currentValue,
          operator: btn,
          history: calcState.currentValue + ' ' + btn,
          waitingForOperand: true
        });
      }
      return;
    }

    if (btn === '%') {
      const val = parseFloat(calcState.currentValue) / 100;
      setCalcState({ ...calcState, currentValue: String(val) });
      return;
    }

    if (btn === '+/-') {
      const val = parseFloat(calcState.currentValue) * -1;
      setCalcState({ ...calcState, currentValue: String(val) });
      return;
    }

    if (calcState.waitingForOperand) {
      setCalcState({
        ...calcState,
        currentValue: btn === '.' ? '0.' : btn,
        waitingForOperand: false
      });
    } else {
      if (calcState.currentValue === '0' && btn !== '.') {
        setCalcState({ ...calcState, currentValue: btn });
      } else {
        if (btn === '.' && calcState.currentValue.includes('.')) return;
        setCalcState({ ...calcState, currentValue: calcState.currentValue + btn });
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black font-sans overflow-y-auto relative">
      {/* Subtle background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.03),transparent_40%)] pointer-events-none"></div>

      <div className="w-full h-full md:max-w-md md:h-auto md:min-h-[85vh] md:rounded-[3rem] bg-gradient-to-br from-gray-800/90 to-gray-900/90 md:border-4 md:border-gray-700/50 flex flex-col p-4 relative shadow-[0_0_80px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.1)] backdrop-blur-xl">

        {/* Header with enhanced buttons */}
        <div className="flex justify-between z-20 mb-4 px-2 pt-2">
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-3 py-2 rounded-full font-bold text-xs bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700 transition-all border-2 border-gray-600/50 hover:border-gray-500 hover:text-white shadow-lg hover:shadow-xl active:scale-95"
            title="清空历史记录"
          >
            <Trash2 className="mr-1" size={14} />
            <span>清空</span>
          </button>

          <button
            onClick={randomizeUltramen}
            className="flex items-center space-x-2 px-3 py-2 rounded-full font-bold text-xs bg-gradient-to-br from-blue-600 to-indigo-700 text-white hover:from-blue-500 hover:to-indigo-600 transition-all border-2 border-blue-500/50 hover:border-blue-400 shadow-lg shadow-blue-900/50 hover:shadow-xl hover:shadow-blue-800/60 active:scale-95"
          >
            <RefreshCw className="mr-1" size={14} />
            <span>换一批</span>
          </button>
        </div>

        {/* Enhanced display area */}
        <div className="flex-1 flex flex-col justify-end items-end mb-6 space-y-1 px-4 min-h-[150px] w-full bg-gradient-to-br from-gray-900/50 to-black/30 rounded-3xl p-6 border-2 border-gray-700/30 shadow-inner">
          {/* History Log Area */}
          <div className="w-full flex-1 overflow-y-auto mb-2 relative scrollbar-hide min-h-[80px]">
            {historyLog.length === 0 && (
              <div className="flex h-full items-center justify-center text-gray-500 text-sm italic">
                <Zap className="w-4 h-4 mr-2 text-blue-400" />
                暂无历史记录
              </div>
            )}
            <div className="flex flex-wrap justify-end items-end gap-x-4 gap-y-1 min-h-full content-end pb-2 px-1">
              {historyLog.map((log, idx) => {
                const isLast = idx === historyLog.length - 1;
                return (
                  <span key={idx} className={`text-lg font-light whitespace-nowrap transition-all ${isLast ? 'text-blue-300 font-medium' : 'text-gray-500'}`}>
                    {log}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="text-orange-400 text-xl font-light min-h-[2rem] text-right w-full break-all drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]">
            {calcState.history}
          </div>
          <div className="text-white text-6xl sm:text-7xl font-thin tracking-tight break-all text-right w-full drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {calcState.currentValue}
          </div>
        </div>

        <div className="w-full grid grid-cols-4 gap-3 sm:gap-4 pb-4">
          {KEYS.map((key) => {
            const isOperator = ['/', '*', '-', '+', '='].includes(key);
            const isAction = ['AC', '+/-', '%'].includes(key);
            const isZero = key === '0';

            return (
              <div key={key} className={`${isZero ? 'col-span-2' : ''} w-full`}>
                <CalculatorButton
                  label={key}
                  config={configs[key]}
                  onClick={handlePress}
                  isOperator={isOperator}
                  isAction={isAction}
                  isZero={isZero}
                />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
