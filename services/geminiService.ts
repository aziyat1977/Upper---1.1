import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  return new GoogleGenAI({ apiKey });
};

export const upgradeSentence = async (sentence: string): Promise<string> => {
  try {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are an expert ESL teacher running a "Correction Spot" or "Upgrade Zone" on the whiteboard.
      The student said: "${sentence}"
      
      Task:
      1. Identify if there is a grammatical error or if it sounds unnatural (awkward).
      2. If it's an error, correct it.
      3. If it's correct but basic, "upgrade" it to use a C1/C2 advanced phrase or idiom related to conversation rules (e.g., "put someone at ease", "hit it off").
      4. Keep the explanation extremely brief (1 sentence max).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            correction: { type: Type.STRING },
            explanation: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["CORRECTION", "UPGRADE"] }
          },
          required: ["original", "correction", "explanation", "type"]
        }
      }
    });

    let text = response.text;
    
    // Sanitize: Strip potential markdown code blocks if the model adds them
    if (text) {
        text = text.replace(/```json\n?|\n?```/g, '').trim();
    }

    // Double check it parses
    JSON.parse(text || '{}');

    return text || JSON.stringify({ 
      original: sentence,
      correction: "Could not generate analysis.", 
      explanation: "Please try again.", 
      type: "ERROR" 
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return JSON.stringify({ 
      original: sentence,
      correction: "Error connecting to AI.", 
      explanation: "Please check your connection and API key.",
      type: "ERROR"
    });
  }
};

export const analyzePronunciation = async (text: string): Promise<string> => {
    // Mocking pronunciation analysis for now as Audio handling requires backend streaming usually
    // In a real implementation with Live API, we would stream audio bytes.
    return "Great effort! Focus on the intonation at the end of the question.";
}