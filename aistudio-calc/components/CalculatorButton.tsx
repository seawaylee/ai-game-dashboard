
import React, { useState, useEffect } from 'react';
import { UltramanConfig, GENERIC_ULTRAMAN_BASE64 } from '../types';
import { Loader2 } from 'lucide-react';

interface CalculatorButtonProps {
  label: string;
  config?: UltramanConfig;
  onClick: (label: string) => void;
  isOperator?: boolean;
  isZero?: boolean;
  isAction?: boolean;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  label,
  config,
  onClick,
  isOperator,
  isZero,
  isAction
}) => {

  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Prefer local asset (imageUrl) over cached data
    if (config?.imageUrl) {
      setImgSrc(config.imageUrl);
      setImgError(false);
    } else if (config?.cachedUrl) {
      setImgSrc(config.cachedUrl);
      setImgError(false);
    } else {
      setImgSrc(undefined);
    }
  }, [config]);

  // Base classes with enhanced styling
  const baseClasses = "relative overflow-hidden rounded-full flex items-center justify-center text-3xl font-bold transition-all active:scale-95 select-none w-full border-4";

  // Sizing
  let sizeClasses = "aspect-square";
  if (isZero) sizeClasses = "aspect-[2.1/1]";

  // Colors & Gradients
  let colorClasses = "bg-gray-800 text-white border-gray-600";
  let shadowClasses = "shadow-xl hover:shadow-2xl";

  if (isOperator) {
    colorClasses = "bg-gradient-to-br from-orange-600 to-red-500 text-white border-orange-400";
    shadowClasses = "shadow-xl shadow-orange-900/50 hover:shadow-2xl hover:shadow-orange-800/60";
  }
  if (isAction) {
    colorClasses = "bg-gradient-to-br from-gray-200 to-slate-300 text-gray-900 border-gray-400";
    shadowClasses = "shadow-xl shadow-gray-900/30 hover:shadow-2xl hover:shadow-gray-800/40";
  }

  // Ultraman Mode Styles
  const buttonStyle: React.CSSProperties = {};
  if (config) {
    colorClasses = "text-white border-white/30";
    buttonStyle.background = `linear-gradient(135deg, #${config.color} 0%, ${adjustBrightness(config.color, -20)} 100%)`;
    shadowClasses = `shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]`;
  }

  const handleImageError = () => {
    // If loading local asset failed, try cached one if available
    if (imgSrc === config?.imageUrl && config?.cachedUrl) {
      setImgSrc(config.cachedUrl);
      return;
    }

    if (!imgError) {
      setImgError(true);
      setImgSrc(GENERIC_ULTRAMAN_BASE64);
    }
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${colorClasses} ${shadowClasses} hover:scale-105 hover:border-white/50`}
      style={buttonStyle}
      onClick={() => onClick(label)}
      aria-label={config?.name || label}
    >
      {/* Avatar Layer */}
      {config && (
        <div className="absolute inset-0 z-0">
          {/* Lighter overlay for better avatar visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/35 z-10" />

          {/* Loading State */}
          {config.isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-sm">
              <Loader2 className="animate-spin text-white w-8 h-8" />
            </div>
          )}

          {!config.isGenerating && imgSrc && (
            <img
              src={imgSrc}
              alt={config.name}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full transition-all duration-500 z-0 ${imgError ? 'opacity-80 grayscale' : 'opacity-100'
                } ${isZero ? 'object-cover object-center' : 'object-cover'}`}
              onError={handleImageError}
              style={isZero ? { objectPosition: 'center' } : {}}
            />
          )}

          {/* Lighter gradient overlay maintains text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20 pointer-events-none"></div>

          {/* Glow effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-15 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      )}

      {/* Text Label with enhanced shadows */}
      <span
        className="relative z-30 font-roboto font-black text-4xl translate-y-6"
        style={{
          textShadow: `
            0 2px 4px rgba(0,0,0,0.9),
            0 4px 8px rgba(0,0,0,0.8),
            0 6px 12px rgba(0,0,0,0.7),
            0 0 20px rgba(0,0,0,0.5),
            0 0 40px rgba(255,255,255,0.1)
          `
        }}
      >
        {label === '*' ? '×' : label === '/' ? '÷' : label}
      </span>

    </button>
  );
};

// Helper function to adjust color brightness
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

export default CalculatorButton;
