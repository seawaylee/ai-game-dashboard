export enum Player {
  None = 0,
  Black = 1, 
  White = 2,
}

export type BoardState = Player[][];

export enum GameMode {
  PvP = 'PvP',
  PvC = 'PvC',
}

export enum GameStatus {
  Playing = 'Playing',
  Won = 'Won',
  Draw = 'Draw',
}

export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export interface Score {
  p1: number;
  p2: number;
}

// Support generic templates for pieces to allow 50+ items easily
export type PieceTemplate = 'head' | 'block' | 'item_sword' | 'item_pickaxe' | 'item_gem' | 'tnt' | 'slime' | 'creeper_head';

export interface ThemeItem {
  id: string;
  name: string;
  template: PieceTemplate;
  // Colors for generating the graphic
  baseColor: string;
  secondaryColor?: string; // e.g. eyes, ore specs
  detailColor?: string; // e.g. mouth, border
  topColor?: string; // e.g. hair, grass top
}

export interface GameTheme {
  id: string;
  name: string;
  boardColor: string;
  gridColor: string;
  p1: string; // ID of the ThemeItem
  p2: string; // ID of the ThemeItem
}
