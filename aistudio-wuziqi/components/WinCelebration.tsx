import React, { useEffect, useRef } from 'react';
import { Player } from '../types';
import { McPiece } from './McPiece';
import { soundEngine } from '../services/soundEngine';

interface WinCelebrationProps {
  winner: Player;
  winnerAssetId: string;
  onReset: () => void;
}

// Particle Class for Fireworks
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;

  constructor(x: number, y: number, color: string, isRocket: boolean) {
    this.x = x;
    this.y = y;
    this.color = color;
    
    if (isRocket) {
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = -(Math.random() * 4 + 8); // Shoot up
      this.alpha = 1;
      this.size = 4;
    } else {
      // Explosion particle
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.size = Math.random() * 3 + 2;
    }
  }

  update(isRocket: boolean) {
    this.x += this.vx;
    this.y += this.vy;
    
    if (isRocket) {
      this.vy += 0.05; // Slight gravity
    } else {
      this.vy += 0.1; // Gravity
      this.vx *= 0.95; // Air resistance
      this.vy *= 0.95;
      this.alpha -= 0.015; // Fade out
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    // Draw pixelated rect
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

const WinCelebration: React.FC<WinCelebrationProps> = ({ winner, winnerAssetId, onReset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rockets = useRef<Particle[]>([]);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Minecraft Colors
    const colors = ['#DB2E23', '#FDF55F', '#5D9C45', '#4EEFDC', '#C74EBD', '#FFFFFF'];

    const launchRocket = () => {
      const x = Math.random() * canvas.width;
      const y = canvas.height;
      const color = colors[Math.floor(Math.random() * colors.length)];
      rockets.current.push(new Particle(x, y, color, true));
      soundEngine.playFireworkLaunch();
    };

    // Initial launch
    launchRocket();
    const interval = setInterval(launchRocket, 800);

    const animate = () => {
      // Clear with slight trail effect? No, clean clear for pixel art style
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update Rockets
      for (let i = rockets.current.length - 1; i >= 0; i--) {
        const r = rockets.current[i];
        r.update(true);
        r.draw(ctx);

        // Explode condition (slows down vertical speed)
        if (r.vy > -1) {
          // Create explosion
          soundEngine.playFireworkBlast();
          for (let j = 0; j < 50; j++) {
            particles.current.push(new Particle(r.x, r.y, r.color, false));
          }
          rockets.current.splice(i, 1);
        }
      }

      // Update Particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.update(false);
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(interval);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500 overflow-hidden">
       
       <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

       {/* Main Card */}
       <div className="relative bg-[#c6c6c6] border-4 border-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center gap-6 max-w-[90%] transform scale-100 z-10 animate-[bounce_1s_infinite]">
          
          <h2 className="text-4xl md:text-6xl font-pixel text-[#333] drop-shadow-md text-center">
            胜利!
          </h2>

          <div className="flex items-end justify-center gap-4">
             {/* Villager Left */}
             <div className="w-16 h-16 animate-[bounce_0.5s_infinite]">
                <McPiece assetId="villager" />
             </div>
             
             {/* Winner Avatar */}
             <div className="w-32 h-32 border-4 border-yellow-400 shadow-xl bg-black/20 p-2 relative">
               <div className="absolute -top-6 -right-6 text-6xl rotate-12">👑</div>
               <McPiece assetId={winnerAssetId} />
             </div>

             {/* Villager Right */}
             <div className="w-16 h-16 animate-[bounce_0.6s_infinite] delay-100">
                <McPiece assetId="villager" />
             </div>
          </div>
          
          <p className="font-pixel text-xl text-gray-600">
             {winner === Player.Black ? '玩家 1' : '玩家 2'} 获胜!
          </p>

          <button 
            onClick={onReset}
            className="mt-4 bg-[#7cba52] text-white font-pixel text-3xl px-12 py-3 border-b-8 border-r-8 border-[#2e5218] active:border-0 active:translate-y-2 hover:brightness-110 transition-all shadow-xl"
          >
            再来一局
          </button>
       </div>
    </div>
  );
};

export default WinCelebration;
