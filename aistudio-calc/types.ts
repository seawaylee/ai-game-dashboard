
export interface UltramanConfig {
  id: string;
  name: string;
  color: string;
  pitch: number;
  imageUrl?: string;
  cachedUrl?: string;
  isGenerating?: boolean; // New state to track AI generation status
}

export interface CalculatorState {
  currentValue: string;
  previousValue: string | null;
  operator: string | null;
  history: string;
  waitingForOperand: boolean;
}

// 通用的奥特曼剪影 (Base64 SVG)，作为加载失败时的兜底
export const GENERIC_ULTRAMAN_BASE64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSIjZTZlNmU2Ij48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzMzMyIgc3Ryb2tlPSJzaWx2ZXIiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik01MCAyMCBDMzAgMjAgMjAgNDAgMjAgNTAgQzIwIDgwIDQwIDkwIDUwIDkwIEM2MCA5MCA4MCA4MCA4MCA1MCBDODAgNDAgNzAgMjAgNTAgMjAgWiIgZmlsbD0ic2lsdmVyIi8+PGVsbGlXBzZSBjeD0iMzUiIGN5PSI0NSIgcng9IjEwIiByeT0iMTUiIGZpbGw9IiNmZmZhZTUiLz48ZWxsaXBzZSBjeD0iNjUiIGN5PSI0NSIgcng9IjEwIiByeT0iMTUiIGZpbGw9IiNmZmZhZTUiLz48cGF0aCBkPSJNNTAgNTUgTDUwIDc1IiBzdHJva2U9IiNjMDM5MmIiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==`;

// Using Ultraman Fandom Wiki images as fallback data structure for names and colors
export const ULTRAMAN_DATA = [
  { name: "迪迦", color: "8B5CF6" },
  { name: "赛罗", color: "1D4ED8" },
  { name: "初代", color: "E71D1D" },
  { name: "赛文", color: "C91A1A" },
  { name: "泰罗", color: "EF4444" },
  { name: "贝利亚", color: "111827" },
  { name: "梦比优斯", color: "F59E0B" },
  { name: "泽塔", color: "3B82F6" },
  { name: "特利迦", color: "8B5CF6" },
  { name: "戴拿", color: "3B82F6" },
  { name: "盖亚", color: "EF4444" },
  { name: "雷欧", color: "B91C1C" },
  { name: "艾斯", color: "B91C1C" },
  { name: "杰克", color: "D62828" },
  { name: "银河", color: "3B82F6" },
  { name: "艾克斯", color: "60A5FA" },
  { name: "欧布", color: "EF4444" },
  { name: "捷德", color: "7C3AED" },
  { name: "佐菲", color: "A91B1B" },
  { name: "奥特之父", color: "991B1B" },
  { name: "布莱泽", color: "2563EB" },
  { name: "亚刻", color: "F59E0B" },
  { name: "德凯", color: "3B82F6" }
];
