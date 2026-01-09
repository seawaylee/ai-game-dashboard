// Hybrid TTS service: Prefers local WAV files, falls back to Browser TTS

const fileMap: Record<string, string> = {
    '0': '0.wav', '1': '1.wav', '2': '2.wav', '3': '3.wav', '4': '4.wav', 
    '5': '5.wav', '6': '6.wav', '7': '7.wav', '8': '8.wav', '9': '9.wav',
    '.': 'dot.wav', '+': 'plus.wav', '-': 'minus.wav', '*': 'multiply.wav', '/': 'divide.wav',
    '=': 'equal.wav', 'AC': 'ac.wav'
};

export const speakText = (text: string, pitch: number = 0.8, rate: number = 0.9) => {
  // 1. Try to play specific file for keys
  if (fileMap[text]) {
      const audio = new Audio(`/audio/${fileMap[text]}`);
      // Simple pitch shift simulation using playbackRate (not perfect but works)
      // audio.playbackRate = pitch; 
      audio.play().catch(e => console.warn("Audio play failed", e));
      return;
  }

  // 2. Special Phrases
  if (text === "光之国，集结！") {
       const audio = new Audio(`/audio/shuatch.wav`);
       audio.play().catch(e => console.warn(e));
       return;
  }
  
  if (text.includes("正在呼唤") || text.includes("生成")) {
       const audio = new Audio(`/audio/loading.wav`);
       audio.play().catch(e => console.warn(e));
       return;
  }

  // 3. Fallback to Browser TTS (e.g. for calculation results "123.45")
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  // Mapping for Chinese voice
  const zhMap: Record<string, string> = {
    '0': '零', '1': '一', '2': '二', '3': '三', '4': '四', 
    '5': '五', '6': '六', '7': '七', '8': '八', '9': '九',
    '.': '点', '+': '加', '-': '减', '*': '乘以', '/': '除以',
    '=': '等于', 'AC': '归零'
  };

  // Convert numbers to Chinese text for smoother TTS reading if it's a number string
  // But for simple "123", TTS usually handles it.
  const textToSay = zhMap[text] || text;

  const utterance = new SpeechSynthesisUtterance(textToSay);
  
  utterance.lang = 'zh-CN';
  utterance.pitch = pitch; 
  utterance.rate = rate; 
  utterance.volume = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const zhVoices = voices.filter(v => v.lang.includes('zh'));
  if (zhVoices.length > 0) {
      utterance.voice = zhVoices[zhVoices.length - 1]; 
  }

  window.speechSynthesis.speak(utterance);
};

export const getSpokenLabel = (key: string): string => {
  return key; 
};
