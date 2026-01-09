
import { GoogleGenAI } from "@google/genai";

// Initialize the client
// NOTE: We assume process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateUltramanAvatar = async (ultramanName: string): Promise<string | null> => {
  try {
    const prompt = `A high-quality, photorealistic close-up headshot of Ultraman ${ultramanName}. 
    Metallic texture, glowing eyes, cinematic lighting, dark background, 3D render style, 
    heroic pose, facing forward. High resolution icon.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        // Only 1 image needed
        // No specific image config needed for basic generation in flash-image unless resizing
      }
    });

    // Parse response to find the image
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64String = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64String}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
};
