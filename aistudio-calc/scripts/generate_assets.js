import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Hardcoded data from types.ts
const ULTRAMAN_DATA = [
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/avatars');

// Try to read .env.local manually
const loadEnv = () => {
    try {
        const envPath = path.join(__dirname, '../.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf-8');
            for (const line of content.split('\n')) {
                const parts = line.split('=');
                const key = parts[0];
                const value = parts.slice(1).join('='); // Handle values with =
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            }
        }
    } catch (e) {
        console.warn("Could not read .env.local");
    }
};

loadEnv();

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    console.error("❌ Error: API Key not found or invalid in .env.local");
    console.error("Please set GEMINI_API_KEY in .env.local");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const generateAvatar = async (name, color) => {
    const filePath = path.join(OUT_DIR, `${name}.png`);
    if (fs.existsSync(filePath)) {
        console.log(`⏩ Skipping ${name} (already exists)`);
        return;
    }

    console.log(`🎨 Generating ${name}...`);
    try {
        const prompt = `A high-quality, photorealistic close-up headshot of Ultraman ${name}. 
        Metallic texture, glowing eyes, cinematic lighting, dark background, 3D render style, 
        heroic pose, facing forward. High resolution icon.`;

        // Attempting to use the model specified in the project, with fallbacks
        let model = 'gemini-2.5-flash-image'; 
        // Fallback models to try if the primary one fails
        const fallbackModels = ['gemini-2.0-flash-exp', 'gemini-1.5-flash'];

        let response;
        try {
            response = await ai.models.generateContent({
                model,
                contents: { parts: [{ text: prompt }] }
            });
        } catch (e) {
            console.warn(`Model ${model} failed, trying fallbacks...`);
            for (const m of fallbackModels) {
                try {
                     console.log(`Trying ${m}...`);
                     response = await ai.models.generateContent({
                        model: m,
                        contents: { parts: [{ text: prompt }] }
                    });
                    if (response) break;
                } catch (err) {
                    continue;
                }
            }
        }

        if (!response) throw new Error("All models failed.");
        
        // Try to parse image data
        let base64String = null;
        
        // Standard Imagen / Gemini Image response structure often varies
        // Checking for inlineData
        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    base64String = part.inlineData.data;
                    break;
                }
            }
        }

        if (base64String) {
            const buffer = Buffer.from(base64String, 'base64');
            fs.writeFileSync(filePath, buffer);
            console.log(`✅ Saved ${name}`);
        } else {
             // Fallback: If no image data, it might be text saying "I can't do that"
             // console.log("Response parts:", response.candidates[0].content.parts);
             console.error(`⚠️  No image data returned for ${name}. Model might be text-only.`);
        }

    } catch (error) {
        console.error(`❌ Error generating ${name}:`, error.message);
    }
};

const main = async () => {
    if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    console.log(`Starting generation for ${ULTRAMAN_DATA.length} ultramen...`);

    for (const u of ULTRAMAN_DATA) {
        await generateAvatar(u.name, u.color);
        // Sleep to respect rate limits
        await new Promise(r => setTimeout(r, 1500));
    }
    console.log("🎉 Done!");
};

main();
