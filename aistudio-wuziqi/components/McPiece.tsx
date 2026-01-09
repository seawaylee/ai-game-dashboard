import React from 'react';
import { getAsset } from '../constants';

interface McPieceProps {
  assetId: string;
  className?: string;
}

export const McPiece: React.FC<McPieceProps> = ({ assetId, className }) => {
  const asset = getAsset(assetId);
  const commonClasses = `w-full h-full drop-shadow-md ${className || ''}`;
  const { template, baseColor, secondaryColor, detailColor, topColor } = asset;

  // --- TEMPLATE: HEAD (Custom Humanoid / Mob Head) ---
  if (template === 'head') {
    return (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        {/* Face Background (Base) */}
        <rect x="10" y="10" width="80" height="80" fill={baseColor} shapeRendering="crispEdges"/>
        
        {/* Hair / Top Layer */}
        {topColor && (
          <rect x="10" y="10" width="80" height="25" fill={topColor} shapeRendering="crispEdges"/>
        )}

        {/* Alex Style: Long Hair Side Drops */}
        {assetId === 'alex' && topColor && (
           <>
            <rect x="10" y="35" width="10" height="40" fill={topColor} shapeRendering="crispEdges"/>
            <rect x="80" y="35" width="10" height="40" fill={topColor} shapeRendering="crispEdges"/>
           </>
        )}
        
        {/* 3D Border Effect */}
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="4" shapeRendering="crispEdges"/>

        {/* Eyes */}
        <rect x="20" y="45" width="12" height="12" fill={secondaryColor || '#FFF'} shapeRendering="crispEdges"/>
        <rect x="68" y="45" width="12" height="12" fill={secondaryColor || '#FFF'} shapeRendering="crispEdges"/>
        
        {/* Pupils (Only if eyes are white/light) */}
        {(secondaryColor === '#FFF' || secondaryColor === '#FFFFFF') && (
           <>
             <rect x="24" y="48" width="4" height="4" fill="#000" shapeRendering="crispEdges"/>
             <rect x="72" y="48" width="4" height="4" fill="#000" shapeRendering="crispEdges"/>
           </>
        )}

        {/* Mouth/Nose/Detail */}
        {detailColor && (
           <rect x="40" y="65" width="20" height="10" fill={detailColor} shapeRendering="crispEdges"/>
        )}
      </svg>
    );
  }

  // --- TEMPLATE: CREEPER HEAD (Specific) ---
  if (template === 'creeper_head') {
    return (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        <rect x="10" y="10" width="80" height="80" fill={baseColor} shapeRendering="crispEdges"/>
        {/* Border */}
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="#000" strokeWidth="2" shapeRendering="crispEdges"/>
        {/* Face */}
        <rect x="22" y="28" width="20" height="20" fill="#000" shapeRendering="crispEdges"/>
        <rect x="58" y="28" width="20" height="20" fill="#000" shapeRendering="crispEdges"/>
        <rect x="42" y="48" width="16" height="24" fill="#000" shapeRendering="crispEdges"/>
        <rect x="30" y="60" width="12" height="20" fill="#000" shapeRendering="crispEdges"/>
        <rect x="58" y="60" width="12" height="20" fill="#000" shapeRendering="crispEdges"/>
      </svg>
    );
  }

  // --- TEMPLATE: BLOCK (Enhanced with Top Layer) ---
  if (template === 'block') {
    return (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        {/* Base Block */}
        <rect x="10" y="10" width="80" height="80" fill={baseColor} shapeRendering="crispEdges"/>
        
        {/* Top Layer (Grass, Log top, etc) */}
        {topColor && (
           <rect x="10" y="10" width="80" height="25" fill={topColor} shapeRendering="crispEdges"/>
        )}

        {/* 3D Border / Outline */}
        <path d="M10 90 L90 90 L90 10 L10 10 L10 90" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="4" shapeRendering="crispEdges"/>
        <path d="M12 88 L88 88 L88 12 L12 12 L12 88" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" shapeRendering="crispEdges"/>

        {/* Texture noise */}
        <rect x="15" y="15" width="10" height="10" fill="#FFF" opacity="0.1" shapeRendering="crispEdges"/>
        <rect x="25" y="25" width="20" height="20" fill="#000" opacity="0.05" shapeRendering="crispEdges"/>
        <rect x="70" y="70" width="15" height="15" fill="#000" opacity="0.1" shapeRendering="crispEdges"/>
        
        {/* Ore specs */}
        {secondaryColor && secondaryColor !== '#000' && (
          <>
             <rect x="30" y="30" width="15" height="15" fill={secondaryColor} shapeRendering="crispEdges"/>
             <rect x="60" y="60" width="10" height="10" fill={secondaryColor} shapeRendering="crispEdges"/>
             <rect x="65" y="20" width="10" height="10" fill={secondaryColor} shapeRendering="crispEdges"/>
          </>
        )}
      </svg>
    );
  }

  // --- TEMPLATE: TNT ---
  if (template === 'tnt') {
     return (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        <rect x="10" y="10" width="80" height="80" fill={baseColor} shapeRendering="crispEdges"/>
        <rect x="10" y="10" width="80" height="25" fill="#DB2E23" shapeRendering="crispEdges"/>
        <rect x="10" y="80" width="80" height="10" fill="#DB2E23" shapeRendering="crispEdges"/>
        <rect x="10" y="35" width="80" height="40" fill="#fff" shapeRendering="crispEdges"/>
        <text x="50" y="65" fontFamily="monospace" fontSize="30" fontWeight="bold" textAnchor="middle" fill="#000">TNT</text>
        <rect x="40" y="10" width="10" height="10" fill="#666" shapeRendering="crispEdges"/>
        {/* Border */}
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="4"/>
      </svg>
    );
  }

  // --- TEMPLATE: SLIME ---
  if (template === 'slime') {
    return (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        <rect x="10" y="10" width="80" height="80" fill={baseColor} stroke={secondaryColor} strokeWidth="4" shapeRendering="crispEdges"/>
        <rect x="10" y="10" width="80" height="80" fill="#fff" opacity="0.2" rx="4" shapeRendering="crispEdges"/>
        <rect x="25" y="35" width="15" height="15" fill="#2d4f1e" shapeRendering="crispEdges"/>
        <rect x="60" y="35" width="15" height="15" fill="#2d4f1e" shapeRendering="crispEdges"/>
        <rect x="45" y="60" width="10" height="10" fill="#2d4f1e" shapeRendering="crispEdges"/>
      </svg>
    );
  }

  // --- TEMPLATE: ITEM SWORD ---
  if (template === 'item_sword') {
    return (
      <svg viewBox="0 0 100 100" className={commonClasses}>
         {/* Handle */}
         <rect x="20" y="70" width="10" height="10" fill={secondaryColor} shapeRendering="crispEdges"/>
         <rect x="30" y="60" width="10" height="10" fill={secondaryColor} shapeRendering="crispEdges"/>
         {/* Guard */}
         <rect x="30" y="50" width="30" height="10" fill={secondaryColor} shapeRendering="crispEdges"/>
         {/* Blade */}
         <rect x="40" y="40" width="10" height="10" fill={baseColor} shapeRendering="crispEdges"/>
         <rect x="50" y="30" width="10" height="10" fill={baseColor} shapeRendering="crispEdges"/>
         <rect x="60" y="20" width="10" height="10" fill={baseColor} shapeRendering="crispEdges"/>
         {/* Outline/Glow */}
         <path d="M40 40 L70 10" stroke={baseColor} strokeWidth="2"/>
      </svg>
    );
  }

  // --- TEMPLATE: ITEM PICKAXE ---
  if (template === 'item_pickaxe') {
    return (
      <svg viewBox="0 0 100 100" className={commonClasses}>
         {/* Handle */}
         <path d="M50 80 L50 40" stroke={secondaryColor} strokeWidth="8" shapeRendering="crispEdges"/>
         {/* Head */}
         <path d="M20 30 Q50 10 80 30" fill="none" stroke={baseColor} strokeWidth="12" strokeLinecap="square" shapeRendering="crispEdges"/>
      </svg>
    );
  }

  // --- TEMPLATE: GEM ---
  if (template === 'item_gem') {
    return (
      <svg viewBox="0 0 100 100" className={commonClasses}>
        <rect x="30" y="20" width="40" height="60" fill={baseColor} stroke="#FFF" strokeWidth="2" shapeRendering="crispEdges"/>
        <rect x="40" y="30" width="10" height="10" fill="#FFF" opacity="0.5" shapeRendering="crispEdges"/>
      </svg>
    );
  }

  return null;
};
