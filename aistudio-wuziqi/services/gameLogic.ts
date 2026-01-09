import { BOARD_SIZE, WIN_COUNT } from '../constants';
import { BoardState, Player, Difficulty } from '../types';

export const createEmptyBoard = (): BoardState => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(Player.None));
};

export const checkWin = (board: BoardState, row: number, col: number, player: Player): boolean => {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

  for (const [dx, dy] of directions) {
    let count = 1;
    for (let i = 1; i < WIN_COUNT; i++) {
      const r = row + dy * i;
      const c = col + dx * i;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) count++;
      else break;
    }
    for (let i = 1; i < WIN_COUNT; i++) {
      const r = row - dy * i;
      const c = col - dx * i;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) count++;
      else break;
    }
    if (count >= WIN_COUNT) return true;
  }
  return false;
};

// AI Logic wrapper
export const getBestMove = (board: BoardState, aiPlayer: Player, difficulty: Difficulty): { row: number, col: number } | null => {
  // Easy: Random valid move
  if (difficulty === Difficulty.Easy) {
     const moves = getAvailableMoves(board);
     if (moves.length === 0) return null;
     // 30% chance to play completely random, 70% chance to play close to center/occupied
     if (Math.random() < 0.3) {
        return moves[Math.floor(Math.random() * moves.length)];
     }
  }

  // Medium: Greedy heuristic (1-ply)
  // Hard: Look deeper (approximated here by aggressive defensive/offensive weighting)
  // For a full production gomoku, we'd need Minimax with AlphaBeta, but for JS responsive UI, 
  // a heavily weighted heuristic for 5-in-row, 4-in-row, open-3 is usually sufficient for "Hard" casual play.
  
  const opponent = aiPlayer === Player.Black ? Player.White : Player.Black;
  let bestScore = -Infinity;
  let bestMoves: { row: number, col: number }[] = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== Player.None) continue;

      const attackScore = evaluatePosition(board, r, c, aiPlayer);
      const defenseScore = evaluatePosition(board, r, c, opponent);
      
      let currentScore = 0;

      if (difficulty === Difficulty.Easy) {
         // Easy: Very noisy evaluation
         currentScore = attackScore + defenseScore + Math.random() * 50; 
      } else if (difficulty === Difficulty.Medium) {
         // Medium: Balanced
         currentScore = attackScore + (defenseScore * 1.0); 
      } else {
         // Hard: Aggressive defense. If opponent has a winning move (high defense score), we MUST block.
         // Multiplier increases urgency of blocking.
         currentScore = attackScore + (defenseScore * 1.2);
         
         // In Hard, prioritize center more initially
         const center = Math.floor(BOARD_SIZE / 2);
         const dist = Math.abs(r - center) + Math.abs(c - center);
         currentScore -= dist * 2;
      }

      if (currentScore > bestScore) {
        bestScore = currentScore;
        bestMoves = [{ row: r, col: c }];
      } else if (Math.abs(currentScore - bestScore) < 1) { // Fuzzy equality
        bestMoves.push({ row: r, col: c });
      }
    }
  }

  if (bestMoves.length === 0) return getAvailableMoves(board)[0] || null;
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
};

const getAvailableMoves = (board: BoardState) => {
  const moves = [];
  for(let r=0; r<BOARD_SIZE; r++){
    for(let c=0; c<BOARD_SIZE; c++){
      if(board[r][c] === Player.None) moves.push({row:r, col:c});
    }
  }
  return moves;
}

const evaluatePosition = (board: BoardState, row: number, col: number, player: Player): number => {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  let totalScore = 0;

  for (const [dx, dy] of directions) {
    let count = 1;
    let blocked = 0;
    
    // Forward
    let r = row + dy, c = col + dx;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) { count++; r += dy; c += dx; }
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== Player.None) blocked++;

    // Backward
    r = row - dy; c = col - dx;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) { count++; r -= dy; c -= dx; }
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== Player.None) blocked++;

    if (blocked === 2 && count < 5) continue; 

    if (count >= 5) totalScore += 100000;
    else if (count === 4 && blocked === 0) totalScore += 10000; // Open 4 (Win next)
    else if (count === 4 && blocked === 1) totalScore += 1000;  // Blocked 4 (Must block/win)
    else if (count === 3 && blocked === 0) totalScore += 1000;  // Open 3 (Create open 4)
    else if (count === 3 && blocked === 1) totalScore += 100;
    else if (count === 2 && blocked === 0) totalScore += 100;
    else if (count === 2 && blocked === 1) totalScore += 10;
  }
  return totalScore;
};
