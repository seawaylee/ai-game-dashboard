/// <reference types="vite/client" />
import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { DifficultyLevel, LessonContent, Vocabulary, ModelType } from "../types";

// Direct API key (as requested)
const API_KEY = 'sk-s1K4y2PE60DSlBQtZcLgvncSrAipZDzSnEejomeNlFR0u5S4';
const BASE_URL = 'https://api.34ku.com';

// Direct API call to Gemini
async function callGeminiApi(model: string, data: any) {
  const url = `${BASE_URL}/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error Details:", errorData);
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Model Configuration Map
const getModels = (type: ModelType) => {
  // CONFIGURATION REQUESTED BY USER
  // Fixed Text Model
  const textModel = 'gemini-3-flash-preview';

  if (type === 'pro') {
    return {
      text: textModel,
      image: 'gemini-3-pro-image-preview',
      vision: textModel
    };
  }

  // Flash mode (Default)
  return {
    text: textModel,
    image: 'gemini-2.5-flash-image',
    vision: textModel
  };
};

const ttsModel = 'gemini-2.0-flash'; // Placeholder

// Audio Context Singleton
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioContext;
};

const getLessonSchema = (count: number): Schema => ({
  type: Type.OBJECT,
  properties: {
    vocabulary: {
      type: Type.ARRAY,
      description: `A list of exactly ${count} key vocabulary words related to the topic.`,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: "The English word." },
          phonetic: { type: Type.STRING, description: "IPA phonetic transcription." },
          translation: { type: Type.STRING, description: "Simplified Chinese (简体中文) translation of the word." },
        },
        required: ["word", "phonetic", "translation"],
      },
    },
    sentences: {
      type: Type.ARRAY,
      description: "2 example sentences using the vocabulary.",
      items: {
        type: Type.OBJECT,
        properties: {
          english: { type: Type.STRING },
          chinese: { type: Type.STRING },
        },
        required: ["english", "chinese"],
      },
    },
    imagePrompt: {
      type: Type.STRING,
      description: "A description of a single cohesive scene where all these vocabulary items would naturally appear together.",
    },
  },
  required: ["vocabulary", "sentences", "imagePrompt"],
});

export const generateLessonData = async (
  topic: string,
  difficulty: DifficultyLevel,
  wordCount: number = 10,
  modelType: ModelType = 'flash'
): Promise<LessonContent> => {
  try {
    const models = getModels(modelType);
    const prompt = `
      Create an English vocabulary lesson card for the topic: "${topic}".
      Difficulty Level: ${difficulty}.
      
      Requirements:
      1. Provide exactly ${wordCount} relevant vocabulary words.
      2. Provide 2 example sentences.
      3. Describe a single scene (imagePrompt) that naturally contains all these items.
      4. ALL Chinese must be Simplified Chinese (简体中文).
    `;

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: getLessonSchema(wordCount),
      },
      systemInstruction: {
        parts: [{ text: "You are an expert ESL teacher creating study materials for Chinese students." }]
      }
    };

    const data = await callGeminiApi(models.text, requestBody);

    // Parse response
    const candidate = data.candidates?.[0];
    if (!candidate || !candidate.content || !candidate.content.parts || !candidate.content.parts[0].text) {
      throw new Error("No valid response from AI");
    }

    const text = candidate.content.parts[0].text;
    if (!text) throw new Error("No response from AI");

    const parsedData = JSON.parse(text);
    return {
      topic,
      fullPrompt: prompt,
      ...parsedData,
    };
  } catch (error) {
    console.error("Error generating lesson text:", error);
    throw error;
  }
};

export const generateSceneImage = async (
  topic: string,
  basePrompt: string,
  vocabulary: Vocabulary[],
  modelType: ModelType = 'flash'
): Promise<{ imageBase64: string, finalPrompt: string }> => {
  try {
    const models = getModels(modelType);

    // Lowercase and English+IPA only (Removed Chinese)
    const vocabList = vocabulary.map(v =>
      `"${v.word.toLowerCase()}" (IPA: ${v.phonetic})`
    ).join(', ');

    // Simplified Labeling Style
    const labelingStyle = `
    - **TEXT CONTENT**: Inside each bubble, write EXACTLY two lines:
      1. **${vocabulary[0].word.toLowerCase()}** (The English Word, in LOWERCASE)
      2. **${vocabulary[0].phonetic}** (The IPA Phonetic)
    - **CASE**: All English words must be strictly **LOWERCASE** (e.g. "apple", not "Apple").
    - **ENGLISH/IPA ONLY**: Do NOT include Chinese characters or translations.
    `;

    // Optimized prompt matching the reference image style
    const finalPrompt = `
    Create a "Search and Find" style educational illustration for the topic: "${topic}".
    
    Scene Description: ${basePrompt}
    
    **CRITICAL GOAL**: You MUST illustrate AND LABEL exactly ${vocabulary.length} items: ${vocabList}.
    
    **ART STYLE (Strict Adherence):**
    - **LIGNE CLAIRE / THICK OUTLINES**: All characters and objects MUST have distinct, consistent BLACK OUTLINES (cartoon vector art style).
    - **FLAT COLORING**: Use bright, solid colors. No complex shading or gradients.
    
    **LABELING INSTRUCTIONS (HIGHEST PRIORITY):**
    1. **EVERY ITEM MUST BE LABELED**: It is a FAILURE if you draw an object but do not attach a speech bubble to it.
    2. **ONE LABEL PER ITEM**: Draw exactly one bubble for each of the ${vocabulary.length} words listed above.
    3. **CLEAR POINTERS**: Every speech bubble MUST have a distinct tail or line pointing DIRECTLY to the correct object.
    
    **LABEL CONTENT**:
    ${labelingStyle}
    
    **LAYOUT**:
    - Distribute the ${vocabulary.length} objects across the scene.
    - DO NOT clutter them or hide them. Ensure there is white space for the speech bubbles.
    `;

    // Construct request for image generation
    const requestBody = {
      contents: [{ parts: [{ text: finalPrompt }] }],
      // Relying on prompt and model capabilities.
      generationConfig: {}
    };

    const data = await callGeminiApi(models.image, requestBody);

    // Check for inline data (image)
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts;

    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return {
            imageBase64: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
            finalPrompt: finalPrompt
          };
        }
      }

      // Error handling if text returned instead
      if (parts[0]?.text) {
        console.warn("Image generation returned text:", parts[0].text);
        throw new Error(`Model returned text instead of image: ${parts[0].text.substring(0, 50)}...`);
      }
    }

    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

// --- Audio Logic ---

// Reverted to Local Browser TTS (Free Mode)
// Store reference to prevent garbage collection
let currentUtterance: SpeechSynthesisUtterance | null = null;

export const playTTS = async (text: string) => {
  if (!text || !text.trim()) return false;

  console.log("Using Local TTS (Free Mode) for:", text);

  try {
    // 1. Cancel previous speech
    window.speechSynthesis.cancel();

    // 2. Wait a bit for the engine to reset
    await new Promise(resolve => setTimeout(resolve, 50));

    // 3. WAKE UP CALL: Speak a silent space to initialize the engine
    // This absorbs the "start truncation" bug common in Chrome
    const warmUp = new SpeechSynthesisUtterance(" ");
    warmUp.volume = 0; // Silent
    warmUp.rate = 2; // Fast
    window.speechSynthesis.speak(warmUp);

    // 4. Create actual utterance
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'en-US';
    currentUtterance.rate = 0.85;

    // 5. Voice Selection
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      await new Promise<void>(resolve => {
        window.speechSynthesis.onvoiceschanged = () => resolve();
        setTimeout(resolve, 500);
      });
      voices = window.speechSynthesis.getVoices();
    }

    const preferredVoice = voices.find(v => v.name.includes('Google US English'))
      || voices.find(v => v.name.includes('Samantha'))
      || voices.find(v => v.lang === 'en-US');

    if (preferredVoice) {
      currentUtterance.voice = preferredVoice;
    }

    // 6. Speak actual text
    window.speechSynthesis.speak(currentUtterance);

    // Cleanup reference when done
    currentUtterance.onend = () => {
      currentUtterance = null;
    };

    return true;
  } catch (e) {
    console.error("Local TTS Error:", e);
    return false;
  }
};